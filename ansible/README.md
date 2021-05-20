# Ansible

<br />

## Tasks
  | Instances  | Flavors |                 Volumes                 |
  | :--------: | :-----: | :-------------------------------------: |
  | instance_1 |   1c4g  |                 Frontend                |
  | instance_2 |   2c9g  |  CouchDB master node, tweets harvester  |
  | instance_3 |   1c4g  |            CouchDB work node            |
  | instance_4 |   1c4g  |            CouchDB work node            |
<br />
## Instructions

### 1. Copy OpenStack Password (for NeCTAR)
```
MDJhMzgyMDQ2YjBlZWU3
```

### 2. Run Instances Launching Scripts
* Install pip and openstacksdk
* Show all images (Ubuntu 20.04)
* Create volumes
  | Instances  | Volumes |
  | :--------: | :-----: |
  | instance_1 |  100G   |
  | instance_2 |  100G   |
  | instance_3 |  100G   |
  | instance_4 |  100G   |
* Create security Groups (port 1 - 65535)
* Create instances
  
Ubuntu
```
./launch-instances.sh
```
MacOS
```
sh ./launch-instances.sh
```

### 3. Setup environments
* Add proxies and install dependencies
* Mount volumes to instances
* Set proxies for docker
* Clone git repository to our instances

Ubuntu
```
./setup-environment.sh
```
MacOS
```
sh ./setup-environment.sh
```

### 4. Deploy
* Start CouchDB containers
* Form CouchDB clusters
* Deploy tweets harvester on instance_2 (dbMaster)
* Push AURIN data to CouchDB
* Add map-reduce functions to CouchDB
* Deploy frontend
```
./deploy.sh
```
MacOS
```
sh ./deploy.sh
```