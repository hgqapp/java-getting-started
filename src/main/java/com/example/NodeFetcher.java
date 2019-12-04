package com.example;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.core.io.ClassPathResource;

import javax.imageio.ImageIO;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class NodeFetcher {

    private String email = "asdfjkljioj@qq.com";
    private String password = "qq123456";
    private String host = "https://2046ssapi.fun";

    private int r = 115;
    private int g = 115;
    private int b = 120;
    private int x = 70;
    private static ITesseract tesseract = new Tesseract();


    static {
        Unirest.setDefaultHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
        tesseract.setLanguage("eng");
        try {
            tesseract.setDatapath(new ClassPathResource("tessdata").getFile().getAbsolutePath());
        } catch (IOException ignore) {
        }
    }

    public NodeFetcher() {
    }

    public NodeFetcher(String email) {
        this(email, null);
    }

    public NodeFetcher(String email, String password) {
        this(email, password, null);
    }

    public NodeFetcher(String email, String password, String host) {
        if (email != null && email.trim().length() > 0) {
            this.email = email;
        }
        if (password != null && password.trim().length() > 0) {
            this.password = password;
        }
        if (host != null && host.trim().length() > 0) {
            this.host = host;
        }
    }

    /**
     * {"exception_data":{},"code":30014,"data":{},"message":"安全校验不通过，请刷新页面重试"}
     *
     * @param args
     *
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        NodeFetcher nodefetcher = new NodeFetcher();
        nodefetcher.fetch();
    }

    public List<String> fetch() throws Exception {
        Unirest.setHttpClient(HttpClientBuilder.create().build());
        String token = parseCSRFToken();
        final boolean registed = checkIsRegisted(token);
        if (registed) {
            login();
        } else {
            regist();
        }
        return getNodeList();
    }

    private void login() throws Exception {
        Unirest.post(host + "/user/account/login")
                .field("email", email)
                .field("password", password)
                .field("agree_terms", 1)
                .field("device_id", "")
                .asString();
    }

    public String getCSRFToken(String initText) throws Exception {
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("javascript");
        engine.eval("var window = {}");
        engine.eval(initText);
        engine.eval("function a(){return G}");
        engine.eval(Js.content);
        Invocable invocable = (Invocable) engine;
        final Object result = invocable.invokeFunction("a");
        ScriptObjectMirror o = (ScriptObjectMirror) result;
        return o.get("csrf_token").toString();
    }

    public String parseCSRFToken() throws Exception {
        final HttpResponse<String> loginBody = Unirest.get(host + "/portal/account/login").asString();
        final Document document = Jsoup.parse(loginBody.getBody());
        final Elements fixedScript = document.getElementsByAttributeValue("data-id", "fixed_script");
        final String data = fixedScript.last().data();
        return getCSRFToken(data);
    }

    public boolean checkIsRegisted(String token) throws Exception {
        final String code = getCode().trim();
        System.out.println("请求Token：" + token);
        System.out.println("请求验证码：" + code);
        HttpResponse<JsonNode> response = Unirest.post(host + "/user/account/check-is-registed")
                .field("email", email)
                .field("csrf_token", token)
                .field("verify_code", code)
                .asJson();
        JSONObject object = response.getBody().getObject();
        int c = object.getInt("code");
        if (c != 0) {
            throw new IllegalArgumentException("验证失败，请求结果：" + response.getBody());
        }
        final JSONObject data = object.getJSONObject("data");
        return data.getBoolean("is_registed");
    }

    public void regist() throws Exception {
        Unirest.post(host + "/user/account/regist")
                .field("email", email)
                .field("password", password)
                .field("inviter_email", "")
                .field("agree_terms", 1)
                .field("device_id", "")
                .field("regist_is_app", 0)
                .asString();
    }

    public List<String> getNodeList() throws Exception {
        HttpResponse<String> response = Unirest.get(host + "/portal/order/node").asString();
        String body = response.getBody();
        body = body.substring(body.indexOf("node_data:") + 10);
        body = body.substring(0, body.indexOf("}}") + 2);
        List<String> result = new ArrayList<>();
        JsonNode jsonNode = new JsonNode(body);
        JSONObject object = jsonNode.getObject();
        for (String key : object.keySet()) {
            JSONObject value = (JSONObject) object.get(key);
            if ("FREE".equalsIgnoreCase(value.getString("vip_level"))
                    && "TROJAN".equalsIgnoreCase(value.getString("net_type"))
                    && value.has("quick_url_raw")) {
                String quickUrlRaw = value.getString("quick_url_raw");
                if (quickUrlRaw != null && quickUrlRaw.trim().length() > 0) {
                    result.add(quickUrlRaw);
                }
            }
        }
        if (result.isEmpty()) {
            throw new IllegalArgumentException("没有可用的免费节点");
        }
        return result;
    }

    public String getCode() throws Exception {
        HttpResponse<InputStream> binary = Unirest.get(host + "/portal/account/get-verify-image").asBinary();
        InputStream input = binary.getBody();
        BufferedImage bufferedImage = removeBackground(input);
        return tesseract.doOCR(bufferedImage);
    }

    public BufferedImage removeBackground(InputStream input) throws Exception {
        BufferedImage img = ImageIO.read(input);
        int width = img.getWidth();
        int height = img.getHeight();
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                if (checkColor(img.getRGB(i, j))) {
                    img.setRGB(i, j, Color.WHITE.getRGB());
                }
            }
        }
        return img;
    }

    public boolean checkColor(int rgb) {
        final Color color = new Color(rgb);
        return color.getRed() > (r - x) && color.getRed() < (r + x)
                && color.getGreen() > (g - x) && color.getGreen() < (r + x)
                && color.getBlue() > (b - x) && color.getBlue() < (r + x);

    }
}
