package com.conveyal.gtfs.datatools;

import com.conveyal.gtfs.api.*;
import com.conveyal.gtfs.datatools.controllers.ConfigController;
import com.sun.org.apache.xpath.internal.operations.Bool;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

import static spark.SparkBase.port;
import static spark.SparkBase.staticFileLocation;


/**
 * Created by landon on 2/23/16.
 */
public class ServiceAlerts {
    public static final Properties config = new Properties();
    public static void main(String[] args) throws IOException {
        FileInputStream in;

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
            String[] feedList  = config.getProperty("application.feed_list").split("_");

            // TODO: fetch list of feedsources from data manager instead of from application.conf
            // TODO: figure out authentication to data manager??
//            String url = "";
//            InputStream response = new URL(url).openStream();
            ApiMain.initialize(null, false, config.getProperty("application.s3.gtfs_bucket"), null, feedList);
        }


        if(config.containsKey("application.port")) {
            port(Integer.parseInt(config.getProperty("application.port")));
        }

        // static location must be set before routes are defined
        staticFileLocation("/public");

        // set gtfs-api calls to use "/api/" prefix

        ConfigController.register("/api/");
        Routes.routes("api");

    }
}
