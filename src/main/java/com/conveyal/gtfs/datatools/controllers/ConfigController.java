package com.conveyal.gtfs.datatools.controllers;

import com.conveyal.gtfs.datatools.ServiceAlerts;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.Request;
import spark.Response;

import java.io.Serializable;

import static spark.Spark.get;

/**
 * Created by demory on 3/15/16.
 */

public class ConfigController {

    public static final Logger LOG = LoggerFactory.getLogger(ConfigController.class);

    public static ObjectMapper objectMapper = new ObjectMapper();

    public static Config getConfig(Request req, Response res) throws JsonProcessingException {
        return new Config();
    }

    public static void register (String apiPrefix) {
        get(apiPrefix + "config", ConfigController::getConfig, objectMapper::writeValueAsString);
    }
}

class Config implements Serializable {
    public final String auth0Domain = ServiceAlerts.config.getProperty("application.auth0.domain");
    public final String auth0ClientId = ServiceAlerts.config.getProperty("application.auth0.client_id");
    public final String managerUrl = ServiceAlerts.config.getProperty("application.manager_url");
    public final String editorUrl = ServiceAlerts.config.getProperty("application.editor_url");
    public final String userAdminUrl = ServiceAlerts.config.getProperty("application.user_admin_url");
    public final String logo = ServiceAlerts.config.getProperty("application.logo");
    public final String title = ServiceAlerts.config.getProperty("application.title");
    public final String activeProjectId = ServiceAlerts.config.getProperty("application.active_project_id");
    public final String rtdApi = ServiceAlerts.config.getProperty("application.rtd_api");
}
