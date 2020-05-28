FROM ubuntu

RUN apt-get update
RUN apt-get -y install default-jdk

ADD . /code

RUN rm -f /code/*.class
RUN cd /code; javac -cp .:mallet.jar:trove-2.0.2.jar:gson-2.3.jar inference.java

WORKDIR /code

CMD /code/inference.sh
