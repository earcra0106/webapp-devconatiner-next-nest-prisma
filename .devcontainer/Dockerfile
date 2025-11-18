FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# 必要なパッケージのインストール
RUN apt update && apt install -y \
    git \
    curl \
    wget \
    vim \
    build-essential \
    sudo \
    nodejs \
    npm && \
    ln -s /usr/bin/nodejs /usr/local/bin/node && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# sudoを実行可能にする
RUN usermod -aG sudo ubuntu
RUN echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# nodeの使用バージョンをインストール
RUN npm install -g n && \
# なぜか環境変数の展開がうまくいかないため、直接バージョンを指定
    n 24.11.1

# nestjs cliのインストール
RUN npm install -g @nestjs/cli

USER ubuntu

WORKDIR /workspace