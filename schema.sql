
-- ... (Previous tables: clientes, fornecedores, produtos, ativos, equipamentos, veiculos, tabelas_preco, pedidos_venda, pedidos_compra, transferencias, ajustes_inventario, entradas_vasilhame, rotas, rotas_pedidos, entregas, entregas_itens, rastreamento_veiculos...)

-- ═══════════════════════════════════════════════════════════
-- 22. PÁTIO & MOVIMENTAÇÃO FÍSICA
-- ═══════════════════════════════════════════════════════════

-- CARREGAMENTOS (Saída para Rota)
CREATE TABLE patio_carregamentos (
  id SERIAL PRIMARY KEY,
  rota_id INTEGER REFERENCES rotas(id),
  veiculo_id INTEGER REFERENCES veiculos(id),
  motorista_id INTEGER REFERENCES usuarios(id),
  data_hora_inicio TIMESTAMP,
  data_hora_fim TIMESTAMP,
  status VARCHAR(30) CHECK (status IN ('Pendente', 'Em Andamento', 'Concluído', 'Cancelado')),
  responsavel_id INTEGER REFERENCES usuarios(id),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DESCARREGAMENTOS (Retorno de Rota)
CREATE TABLE patio_descarregamentos (
  id SERIAL PRIMARY KEY,
  rota_id INTEGER REFERENCES rotas(id),
  veiculo_id INTEGER REFERENCES veiculos(id),
  motorista_id INTEGER REFERENCES usuarios(id),
  data_hora_chegada TIMESTAMP,
  data_hora_descarregamento TIMESTAMP,
  qtd_declarada_barril_30l INTEGER,
  qtd_conferida_barril_30l INTEGER,
  qtd_declarada_barril_20l INTEGER,
  qtd_conferida_barril_20l INTEGER,
  divergencia BOOLEAN DEFAULT FALSE,
  justificativa_divergencia TEXT,
  condicao JSON, -- {bomEstado: X, precisaLimpeza: Y, precisaReparo: Z}
  responsavel_id INTEGER REFERENCES usuarios(id),
  observacoes TEXT,
  status VARCHAR(30) CHECK (status IN ('Pendente', 'Em Andamento', 'Concluído')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAÍDAS DE VASILHAME (Não relacionadas a vendas diretas)
CREATE TABLE patio_saidas_vasilhame (
  id SERIAL PRIMARY KEY,
  data_hora TIMESTAMP NOT NULL,
  tipo_saida VARCHAR(50) CHECK (tipo_saida IN ('Manutenção Externa', 'Limpeza Externa', 'Transferência', 'Devolução Fornecedor', 'Baixa Perda')),
  fornecedor_id INTEGER REFERENCES fornecedores(id), -- se aplicável
  deposito_destino_id INTEGER, -- se transferência (referencia a tabela de locais/empresas)
  tipo_ativo VARCHAR(50),
  quantidade INTEGER,
  serials JSON, -- array de serials ['BAR-001', 'BAR-002']
  motivo TEXT,
  responsavel_id INTEGER REFERENCES usuarios(id),
  observacoes TEXT,
  status VARCHAR(30) DEFAULT 'Concluído',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX idx_patio_carreg_rota ON patio_carregamentos(rota_id);
CREATE INDEX idx_patio_descarreg_rota ON patio_descarregamentos(rota_id);
CREATE INDEX idx_patio_saida_data ON patio_saidas_vasilhame(data_hora);

-- VIEW HISTÓRICO (Simulação para o Frontend)
-- CREATE VIEW patio_historico AS ... (Logic handled in backend/frontend usually)
