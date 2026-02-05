
-- ... (Previous tables: clientes, fornecedores, produtos, ativos, equipamentos, veiculos, tabelas_preco, pedidos_venda, pedidos_compra, transferencias, ajustes_inventario, entradas_vasilhame...)

-- ═══════════════════════════════════════════════════════════
-- 21. LOGÍSTICA & ROTEIRIZAÇÃO
-- ═══════════════════════════════════════════════════════════

-- ROTAS
CREATE TABLE rotas (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  numero_rota VARCHAR(20) UNIQUE NOT NULL, -- ROTA-2026-001
  data_rota DATE NOT NULL,
  periodo VARCHAR(20) NOT NULL CHECK (periodo IN ('Manhã', 'Tarde', 'Noite')),
  veiculo_id INTEGER REFERENCES veiculos(id),
  motorista_id INTEGER REFERENCES usuarios(id),
  status VARCHAR(30) NOT NULL DEFAULT 'Em Montagem' 
    CHECK (status IN ('Em Montagem', 'Ativa', 'Concluída', 'Cancelada')),
  regiao_prioritaria VARCHAR(50),
  distancia_total DECIMAL(10,2),
  tempo_estimado INTEGER, -- minutos
  observacoes TEXT,
  romaneio_pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES usuarios(id),
  deleted_at TIMESTAMP
);

-- ROTAS_PEDIDOS (relacionamento N:N)
CREATE TABLE rotas_pedidos (
  id SERIAL PRIMARY KEY,
  rota_id INTEGER REFERENCES rotas(id),
  pedido_id INTEGER REFERENCES pedidos_venda(id),
  ordem_entrega INTEGER NOT NULL, -- 1, 2, 3...
  distancia_km DECIMAL(10,2),
  tempo_estimado INTEGER, -- minutos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENTREGAS (registro de cada entrega individual)
CREATE TABLE entregas (
  id SERIAL PRIMARY KEY,
  rota_id INTEGER REFERENCES rotas(id),
  pedido_id INTEGER REFERENCES pedidos_venda(id),
  ordem_entrega INTEGER,
  data_hora_chegada TIMESTAMP,
  data_hora_confirmacao TIMESTAMP,
  tempo_entrega INTEGER, -- minutos decorridos
  status VARCHAR(30) CHECK (status IN ('Pendente', 'A Caminho', 'Entregue', 'Cancelada', 'Cliente Ausente')),
  atraso_minutos INTEGER DEFAULT 0,
  assinatura_digital TEXT, -- Base64 da assinatura
  nome_recebedor VARCHAR(200),
  observacoes TEXT,
  fotos_comprovante JSON, -- Array de URLs
  avaliacao_cliente INTEGER CHECK (avaliacao_cliente BETWEEN 1 AND 5),
  comentario_cliente TEXT,
  ocorrencias JSON, -- Array de ocorrências registradas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENTREGAS_ITENS (divergências na entrega)
CREATE TABLE entregas_itens (
  id SERIAL PRIMARY KEY,
  entrega_id INTEGER REFERENCES entregas(id),
  produto_id INTEGER REFERENCES produtos_liquidos(id),
  quantidade_pedida INTEGER NOT NULL,
  quantidade_entregue INTEGER NOT NULL,
  motivo_divergencia TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RASTREAMENTO_VEICULOS (GPS em tempo real)
CREATE TABLE rastreamento_veiculos (
  id SERIAL PRIMARY KEY,
  rota_id INTEGER REFERENCES rotas(id),
  veiculo_id INTEGER REFERENCES veiculos(id),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  velocidade DECIMAL(5,2), -- km/h
  timestamp_gps TIMESTAMP NOT NULL,
  bateria_dispositivo INTEGER, -- %
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDICES
CREATE INDEX idx_rotas_data ON rotas(data_rota);
CREATE INDEX idx_rotas_status ON rotas(status);
CREATE INDEX idx_rotas_motorista ON rotas(motorista_id);
CREATE INDEX idx_entregas_rota ON entregas(rota_id);
CREATE INDEX idx_entregas_status ON entregas(status);
CREATE INDEX idx_rastreamento_rota ON rastreamento_veiculos(rota_id, timestamp_gps);
