package com.conveyal.gtfs.datatools;

import com.conveyal.gtfs.api.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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

        ApiMain.initialize(config.getProperty("application.data"));

        if(config.containsKey("application.port")) {
            port(Integer.parseInt(config.getProperty("application.port")));
        }

        // static location must be set before routes are defined
        staticFileLocation("/public");

        // set gtfs-api calls to use "/api/" prefix
        Routes.routes("api");

    }
}
