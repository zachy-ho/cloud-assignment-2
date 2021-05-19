FROM node:14.3.0

# Running proxies
ENV HTTP_PROXY http://wwwproxy.unimelb.edu.au:8000/
ENV HTTPS_PROXY http://wwwproxy.unimelb.edu.au:8000/
ENV http_proxy http://wwwproxy.unimelb.edu.au:8000/
ENV https_proxy http://wwwproxy.unimelb.edu.au:8000/
ENV no_proxy localhost,127.0.0.1,localaddress,172.16.0.0/12,.melbourne.rc.nectar.org.au,.storage.unimelb.edu.au,.cloud.unimelb.edu.au

# Expose 3000 for React app connection
EXPOSE 3000

# Make a directory for the frontend
WORKDIR /usr/frontend

# Copy all files to the working directory
COPY . .

# Install dependencies
RUN npm install
RUN export NODE_OPTIONS=--max_old_space_size=4096

RUN mkdir -p node_modules/node-sass/vendor/linux-x64-64
RUN curl -L https://github.com/sass/node-sass/releases/download/v6.0.0/linux-x64-64_binding.node -o node_modules/node-sass/vendor/linux-x64-64/binding.node
RUN npm rebuild node-sass

# Run harvester
CMD ["npm", "start"]