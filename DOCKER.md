# Build the react app
```bash
    npx vite build
```

# Inside the project directory

## Installer et activer DOCKER

```bash
    sudo systemctl enable --now docker
```

## Installer dockerbuild 
```bash
    ❯ sudo pacman -S docker-buildx
```

## installer ngnix
```bash
    sudo pacman -Syu nginx # for cachyOS
```

## Create the image docker
```bash
    docker run -p 8080:80 sainto:1.0
```

## expose the site in local for test
```bash
sudo ufw allow 8080/tcp
sudo ufw status
```

## create the container fron the docker image
```bash
sudo docker run -d \
       --name stock-management \
       -p 0.0.0.0:5173:80 \
       sainto:1.0
```

## start the container
```bash
    sudo docker start stock-management
```