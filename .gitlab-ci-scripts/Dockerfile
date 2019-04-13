FROM docker:dind

RUN apk update
#RUN apk --no-cache add docker openrc
#RUN rc-update add docker boot
RUN apk --no-cache add py-pip gcc python-dev libc-dev libffi-dev openssl-dev make
RUN pip install docker-compose

RUN apk del gcc python-dev libc-dev libffi-dev openssl-dev make 

RUN docker-compose -v