# Ansible

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
  | instance_1 |   10G   |
  | instance_2 |  100G   |
  | instance_3 |  100G   |
  | instance_4 |  100G   |
  
* Create security Groups (port 22 for SSH and 80 for HTTP)

* Create instances
```
./launch-instances.sh
```

