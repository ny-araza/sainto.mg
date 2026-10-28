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

## Run the docker
```bash
    docker run -p 8080:80 sainto:1.0
```