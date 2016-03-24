package com.conveyal.gtfs.datatools.utils;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.conveyal.gtfs.api.ApiMain;
import com.conveyal.gtfs.datatools.ServiceAlerts;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by landon on 3/24/16.
 */
public class FeedUpdater {
    public List<String> eTags;
    private Timer timer;
    private static AmazonS3Client s3;

    public FeedUpdater(List<String> eTagList, int delay, int seconds){
        this.eTags = eTagList;
        this.timer = new Timer();

        // TODO: check for credentials??
        this.s3 = new AmazonS3Client();


        this.timer.schedule(new UpdateFeedsTask(), delay*1000, seconds*1000);


    }

    public void addFeedETags(String eTag){
        this.eTags.add(eTag);
    }

    public void cancel(){
        this.timer.cancel(); //Terminate the timer thread
    }


    class UpdateFeedsTask extends TimerTask {
        public void run() {
            System.out.println("Fetching feeds...");
            System.out.println("Current eTag list " + eTags.toString());

            ObjectListing gtfsList = s3.listObjects(ServiceAlerts.feedBucket, ServiceAlerts.prefix);
            Boolean feedsUpdated = false;
            for (S3ObjectSummary objSummary : gtfsList.getObjectSummaries()){

                String eTag = objSummary.getETag();
                if (!eTags.contains(eTag)) {
                    String keyName = objSummary.getKey();
                    if (keyName.equals(ServiceAlerts.prefix)){
                        continue;
                    }
                    System.out.println("Updating feed " + keyName);
                    String feedId = keyName.split("/")[1];
                    ApiMain.loadFeedFromBucket(ServiceAlerts.feedBucket, feedId, ServiceAlerts.prefix);
                    addFeedETags(eTag);
                    feedsUpdated = true;
                }
            }
            if (!feedsUpdated) {
                System.out.println("No feeds updated...");
            }
            else {
                System.out.println("New eTag list " + eTags);
            }
            // TODO: compare current list of eTags against list in completed folder

            // TODO: load feeds for any feeds with new eTags
//            ApiMain.loadFeedFromBucket()
        }
    }

}
