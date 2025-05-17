# Build Python dependencies
FROM python:3.9-slim as py
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Node stage
FROM node:16-slim
WORKDIR /app
COPY --from=py /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=py /app/embedding.py /app/colorize.py /app/PRelu_Colorization_Model.h5 ./
COPY package.json .
RUN npm install --only=production
COPY server.js ./
EXPOSE 3000
CMD ["npm","start"]