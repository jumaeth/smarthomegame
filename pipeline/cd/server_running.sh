#!/bin/bash

INSTANCE_NAME="IP34_Webserver"

STATUS=$(openstack server show "$INSTANCE_NAME" -f value -c status)

# Check if status of server, power on if needed
if [ "$STATUS" == "ACTIVE" ]; then
    echo "The server $INSTANCE_NAME is running."
elif [ "$STATUS" == "SHELVED" ]; then
    echo "The server $INSTANCE_NAME is shelved. Unshelving and starting it..."
    openstack server unshelve $INSTANCE_NAME
    openstack server start $INSTANCE_NAME
elif [ "$STATUS" == "SHUTOFF" ]; then
    echo "The server $INSTANCE_NAME is down. starting it..."
    openstack server start $INSTANCE_NAME
else
  echo "The server $INSTANCE_NAME is $STATUS"
fi