FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    doxygen \
    graphviz \
    libc6-dbg \
    git \
    libomp-dev \
    cmake \
    wget

ENV DEP_DIR=/project/grades/Spring-2022/csci3081/dependencies
ENV SRC_DIR=/env

RUN mkdir -p ${SRC_DIR}
RUN mkdir -p ${DEP_DIR}

WORKDIR ${SRC_DIR}
RUN git clone https://github.com/dtorban/CppWebServer.git CppWebServer
RUN mkdir -p ${SRC_DIR}/CppWebServer/build
RUN git clone https://github.com/google/googletest.git gtest
RUN mkdir -p ${SRC_DIR}/gtest/build
WORKDIR ${SRC_DIR}/CppWebServer/build
RUN cmake -DCMAKE_INSTALL_PREFIX=${DEP_DIR} ..
RUN make install
WORKDIR ${SRC_DIR}/gtest/build
RUN cmake -DCMAKE_INSTALL_PREFIX=${DEP_DIR} ..
RUN make install

RUN find ${DEP_DIR} -type d -exec chmod 775 {} \;
RUN find ${DEP_DIR} -type f -exec chmod 664 {} \;

RUN mkdir -p /home/user
COPY . /home/user/repo
WORKDIR /home/user/repo

RUN make -j
EXPOSE 80
CMD while true; do ./build/bin/transit_service 80 apps/transit_service/web/; done

