ARG DEVCONTAINER_UBUNTU_VERSION=latest

FROM ubuntu:${DEVCONTAINER_UBUNTU_VERSION}

ARG NODE_VERSION=latest

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
    n ${NODE_VERSION}

# 自動生成される作業ディレクトリをあらかじめ作成
RUN mkdir -p /workspace/frontend/node_modules && chown -R ubuntu:ubuntu /workspace/frontend/node_modules
RUN mkdir -p /workspace/frontend/.next && chown -R ubuntu:ubuntu /workspace/frontend/.next
RUN mkdir -p /workspace/backend/node_modules && chown -R ubuntu:ubuntu /workspace/backend/node_modules
RUN mkdir -p /workspace/backend/dist && chown -R ubuntu:ubuntu /workspace/backend/dist

USER ubuntu

WORKDIR /workspace