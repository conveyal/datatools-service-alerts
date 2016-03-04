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

        ApiMain.initialize("/Users/demory/gtfs/scratch/");

        // Listen on port 3000 because that's what auth0 callback is set up for
        port(3000); // <- Uncomment this if you want spark to listen to port 5678 in stead of the default 4567

        // static location must be set before routes are defined
        staticFileLocation("/public");

        // set gtfs-api calls to use "/api/" prefix
        Routes.routes("api");

    }
}
