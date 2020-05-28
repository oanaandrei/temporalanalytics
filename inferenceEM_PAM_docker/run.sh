#!/bin/bash

cd /code
cat $1 | java InferenceEntryPoint $2 $3 $4
