# this shows how we can extend/change an existing official image from Docker Hub

FROM nimmis/alpine-apache:latest
# highly recommend you always pin versions for anything beyond dev/learn

WORKDIR /web/html
# change working directory to root of nginx webhost
# using WORKDIR is preferred to using 'RUN cd /some/path'

RUN rm -rf /web/html/

COPY . .

# I don't have to specify EXPOSE or CMD because they're in my FROM
