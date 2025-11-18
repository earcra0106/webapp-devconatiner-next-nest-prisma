# ベースイメージとしてnginxを使用 (2025年11月時点の最新安定版)
FROM nginx:1.29.3-alpine3.22

# 作業ディレクトリを設定
WORKDIR /var/www/public

# nginxの設定ファイルをカスタマイズ
COPY ./docker/web/configs/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/web/configs/default.conf.template /etc/nginx/templates/default.conf.template

# 設定ファイルの権限を設定
RUN chown -R nginx:nginx /etc/nginx

# 必要なキャッシュディレクトリを作成し、権限を設定
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx
    
# nginxユーザで動作
USER nginx

# ポート公開
EXPOSE 8080