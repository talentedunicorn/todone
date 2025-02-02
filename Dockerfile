FROM couchdb:latest
RUN sed -i '2itouch /opt/couchdb/data/persistence.ini && chmod +w /opt/couchdb/data/persistence.ini && fallocate -l 512M /swapfile && chmod 0600 /swapfile && mkswap /swapfile && echo 10 > /proc/sys/vm/swappiness && swapon /swapfile && echo 1 > /proc/sys/vm/overcommit_memory' /docker-entrypoint.sh
