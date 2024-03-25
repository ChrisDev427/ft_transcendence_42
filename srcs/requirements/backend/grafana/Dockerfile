FROM grafana/grafana:latest

WORKDIR /data

COPY ./conf/defaults.ini ./etc/grafana/grafana.ini

COPY ./grafana.db /data/grafana.db

CMD ["grafana-server", "--homepath=/usr/share/grafana", "--config=/etc/grafana/grafana.ini", "--packaging=docker", "cfg:default.paths.data=/data"]