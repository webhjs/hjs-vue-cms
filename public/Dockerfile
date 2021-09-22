FROM nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY public/Nginx.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]