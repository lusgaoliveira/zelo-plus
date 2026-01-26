CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tipo_usuario VARCHAR(255) NOT NULL,
    foto_perfil BYTEA,
    token_expo VARCHAR(255)
);

CREATE TABLE idosos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    codigo_vinculo VARCHAR(255) UNIQUE,
    CONSTRAINT fk_idoso_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

-- Cuidadores (relacionado a um único idoso)
CREATE TABLE cuidadores (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    nome VARCHAR(255),
    data_nascimento TIMESTAMP,
    idoso_id INTEGER,
    codigo_vinculo VARCHAR(255) NOT NULL,
    CONSTRAINT fk_cuidador_idoso FOREIGN KEY (idoso_id) REFERENCES idosos(id),
    CONSTRAINT fk_cuidador_usuario FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE tipo_tarefa (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data_criacao TIMESTAMP,
    data_agendamento TIMESTAMP,
    tipo_id INTEGER,
    nivel INTEGER NOT NULL,
    status VARCHAR NOT NULL,
    idoso_id INTEGER,
    CONSTRAINT fk_tarefa_tipo FOREIGN KEY (tipo_id) REFERENCES tipo_tarefa(id),
    CONSTRAINT fk_tarefa_idoso FOREIGN KEY (idoso_id) REFERENCES idosos(id)
);
