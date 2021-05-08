#!/bin/bash

export ANSIBLE_HOST_KEY_CHECKING=False
. ./unimelb-comp90024-2021-grp-49-openrc.sh; ansible-playbook setup-environment.yaml -i inventory/hosts.ini