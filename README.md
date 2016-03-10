# datatools-service-alerts

## Installation

```
git clone https://github.com/conveyal/datatools-service-alerts.git
cd datatools-service-alerts
cp application.conf.template application.conf
npm install -g webpack
```

Change application.data to gtfs directory and work-offline to true.  Or set gtfs-bucket to s3 bucket


## Build

```
npm install
webpack
mvn clean package
```

## Run

```
java -jar target/datatools-service-alerts.jar
```