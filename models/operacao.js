const validator = require('validator');
const pool = require('../db/postgres.js');

/**
 * Classe para representar uma operação da bolsa de valores.
 * @ param { object } data Objecto javascript (chave: valor) com parâmetros da requisição.
 * @ param { string } errors Array de mensagens de erro de validação de propriedades da classe.
 */
class Operacao {
	constructor(data) {
		this.ATIVOS_VALIDOS = ['PETR4', 'ITSA4', 'BBAS3', 'WEGE3', 'BBSE3'];
		this.TIPOS_VALIDOS = ['compra', 'venda'];

		this.data = data;
		this.errors = [];
	}

	validate() {
		let data = this.data.data;
		let ativo = this.data.ativo;
		let tipoDeOperacao = this.data.tipoDeOperacao;
		let quantidade = this.data.quantidade;
		let preco = this.data.preco;
		let user_id = this.data.user_id;

		if (!Number.isInteger(user_id)) {
			this.errors.push('Formato de user_id inválido.')
		}
		if (!validator.isDate(data)) {
			this.errors.push('Formato de data inválido.')
		}
		if (!validator.isIn(ativo, this.ATIVOS_VALIDOS)) {
			this.errors.push('Código do ativo inválido.')
		}
		if (!validator.isIn(tipoDeOperacao, this.TIPOS_VALIDOS)) {
			this.errors.push('Tipo de operação inválido.')
		}
		if (!validator.isInt(quantidade)) {
			this.errors.push('Quantidade deve ser um número inteiro.')
		} else {
			quantidade = parseInt(quantidade)
			if (quantidade <= 0) {
				this.errors.push('Quantidade deve ser maior que zero.')
			}
		}
		if (!validator.isFloat(preco)) {
			this.errors.push('Preço deve ser um número real.')
		} else {
			preco = parseFloat(preco)
			if (preco <= 0) {
				this.errors.push('Preço deve ser maior que zero.')
			}
		}


		if (this.errors.length === 0) {
			// calculando atributos derivados
			const valorBruto = this.data.preco * this.data.quantidade;
			const taxaB3 = valorBruto * 0.0003; // 0.03% de taxa B3
			const valorLiquido = this.data.tipoDeOperacao === 'compra' ? (valorBruto + taxaB3) : (valorBruto - taxaB3);
			// limpando os dados desnessários ou extras que tenham vindo na requisição e adicionando valores derivados.
			let validatedData = {
				user_id: user_id,
				data: data,
				ativo: ativo,
				tipoDeOperacao: tipoDeOperacao,
				quantidade: quantidade,
				preco: preco,
				valorBruto: valorBruto,
				taxaB3: taxaB3,
				valorLiquido: valorLiquido
			}
			this.data = validatedData;
			// console.log('Operação validada:', this.data);
		}
	}

	create() {
		const query_text = 'INSERT INTO operacoes (data, ativo, tipo_de_operacao, quantidade, preco, valor_bruto, taxa_b3, valor_liquido, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;'
		const query_params = [this.data.data, this.data.ativo, this.data.tipoDeOperacao, this.data.quantidade, this.data.preco, this.data.valorBruto, this.data.taxaB3, this.data.valorLiquido, this.data.user_id];
		// console.log('user_data', this.data)
		return new Promise((resolve, reject) => {
			pool.query(query_text, query_params, (error, result) => {
				if (error) {
					reject('Erro ao inserir operação: ' + error);
				} else {
					const idDaOperacaoSalva = result.rows[0].id;
					resolve(idDaOperacaoSalva);
				}
			});
		})
	}

	readAll() {
		const query_text = 'SELECT id, data, ativo, tipo_de_operacao, quantidade, preco, valor_bruto, taxa_b3, valor_liquido FROM operacoes WHERE user_id = $1 ORDER BY data DESC;';
		const query_params = [this.data.user_id];
		return new Promise((resolve, reject) => {
			pool.query(query_text, query_params, (error, result) => {
				if (error) {
					reject('Erro ao buscar operações: ' + error);
				} else {
					let listaDeOperacoes = []
					for (let row of result.rows) {
						let operacao = parseTuplaToOperacao(row);
						// aqui estamos pegando o atributo data(somente os dados) da instância de Operacao
						// já que não precisamos do onjeto inteiro, pois como os dados vêm do banco (portanto validos) e convertidos.
						listaDeOperacoes.push(operacao.data);
					}
					resolve(listaDeOperacoes);
				}
			});
		})
	}
}

function parseTuplaToOperacao(tupla) {
	let id = tupla.id
	let data = tupla.data
	let ativo = tupla.ativo
	let tipoDeOperacao = tupla.tipo_de_operacao
	let quantidade = tupla.quantidade
	let preco = parseFloat(tupla.preco)
	let valorBruto = parseFloat(tupla.valor_bruto)
	let taxaB3 = parseFloat(tupla.taxa_b3)
	let valorLiquido = parseFloat(tupla.valor_liquido)
	dadosDaOperacao = {
		id: id,
		data: data,
		ativo: ativo,
		tipoDeOperacao: tipoDeOperacao,
		quantidade: quantidade,
		preco: preco,
		valorBruto: valorBruto,
		taxaB3: taxaB3,
		valorLiquido: valorLiquido
	}
	const operacao = new Operacao(dadosDaOperacao)
	return operacao;
}

module.exports = Operacao;