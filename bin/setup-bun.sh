#!/bin/bash
# Script para instalar o bun no ambiente do Heroku

echo "Instalando o bun..."
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

# Verificação da instalação do bun
bun --version
