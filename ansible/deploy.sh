#!/bin/bash

export ANSIBLE_HOST_KEY_CHEKCING=False
. ./unimelb-comp90024-2021-grp-49-openrc.sh; ansible-playbook deploy.yaml -i inventory/hosts.ini