package com.conveyal.gtfs.datatools;

import com.conveyal.gtfs.api.*;
import com.conveyal.gtfs.datatools.controllers.ConfigController;
import com.conveyal.gtfs.datatools.utils.FeedUpdater;
import com.sun.org.apache.xpath.internal.operations.Bool;
import spark.Filter;
import spark.Request;
import spark.Response;
import spark.utils.IOUtils;

import javax.activation.MimeType;
import javax.activation.MimeTypeParseException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import static spark.Spark.before;
import static spark.Spark.halt;
import static spark.SparkBase.externalStaticFileLocation;
import static spark.SparkBase.port;
import static spark.Spark.get;
import static spark.SparkBase.staticFileLocation;


/**
 * Created by landon on 2/23/16.
 */
public class ServiceAlerts {
    public static final Properties config = new Properties();
    public static String feedBucket;
    public static String prefix;
    public static void main(String[] args) throws IOException {
        FileInputStream in;
        List<String> eTagList = new ArrayList<>();

        if (args.length == 0)
            in = new FileInputStream(new File("application.conf"));
        else
            in = new FileInputStream(new File(args[0]));

        config.load(in);

        // if work_offline, use local directory
        if (Boolean.valueOf(config.getProperty("application.work_offline"))){
            ApiMain.initialize(config.getProperty("application.data"));
        }
        // else, use s3
        else {
            feedBucket = config.getProperty("application.s3.gtfs_bucket");
            prefix = config.getProperty("application.s3.prefix");
            System.out.println(feedBucket);

            // get all feeds in completed folder and save list of eTags from initialize
            eTagList.addAll(ApiMain.initialize(null, false, feedBucket, null, null, prefix));

            // set feedUpdater to poll for new feeds every half hour
            FeedUpdater feedUpdater = new FeedUpdater(eTagList, 0, 60*30);
        }


        if(config.containsKey("application.port")) {
            port(Integer.parseInt(config.getProperty("application.port")));
        }

        // static location must be set before routes are defined
//        staticFileLocation("/public");

        // set gtfs-api calls to use "/api/" prefix
        ConfigController.register("/api/");
        Routes.routes("api");

        // TODO: move assets to folder
//        get("/assets/*", (request, response) -> {
//            try (InputStream stream = ApiMain.class.getResourceAsStream("/public/" + request.pathInfo())) {
//                return IOUtils.toString(stream);
//            } catch (IOException e) {
//                return null;
//                // if the resource doesn't exist we just carry on.
//            }
//        });
        get("/main.js", (request, response) -> {
            try (InputStream stream = ApiMain.class.getResourceAsStream("/public/main.js")) {
                return IOUtils.toString(stream);
            } catch (IOException e) {
                return null;
                // if the resource doesn't exist we just carry on.
            }
        });

        // return index.html for any sub-directory
        get("/*", (request, response) -> {
            response.type("text/html");
            try (InputStream stream = ApiMain.class.getResourceAsStream("/public/index.html")) {
                return IOUtils.toString(stream);
            } catch (IOException e) {
                return null;
                // if the resource doesn't exist we just carry on.
            }
        });

    }
}
