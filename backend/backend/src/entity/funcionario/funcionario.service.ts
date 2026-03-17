import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { FuncionarioEntity } from './funcionario.entity'
import { FuncaoEntity } from '../funcao/funcao.entity'
import { DepartamentoEntity } from '../departamento/departamento.entity'

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(FuncionarioEntity)
    private readonly repo: Repository<FuncionarioEntity>,

    @InjectRepository(FuncaoEntity)
    private readonly funcaoRepo: Repository<FuncaoEntity>,

    @InjectRepository(DepartamentoEntity)
    private readonly departamentoRepo: Repository<DepartamentoEntity>,
  ) {}

  async listar(
    idtb_empresas: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo
      .createQueryBuilder('f')
      .leftJoin(FuncaoEntity, 'fu', 'fu.func_id = f.funcao_id')
      .leftJoin(DepartamentoEntity, 'd', 'd.dpto_id = f.dpto_id')
      .select([
        'f.funcionario_id as funcionario_id',
        'f.idtb_empresas as idtb_empresas',
        'f.nome_completo as nome_completo',
        'f.cpf as cpf',
        'f.rg as rg',
        'f.pis_pasep as pis_pasep',
        'f.data_nascimento as data_nascimento',
        'f.endereco as endereco',
        'f.cep as cep',
        'f.bairro as bairro',
        'f.municipio as municipio',
        'f.sexo as sexo',
        'f.estado_civil as estado_civil',
        'f.grau_instrucao as grau_instrucao',
        'f.carteira_trabalho as carteira_trabalho',
        'f.serie as serie',
        'f.uf as uf',
        'f.data_carteira_trabalho as data_carteira_trabalho',
        'f.data_admissao as data_admissao',
        'f.data_demissao as data_demissao',
        'f.funcao_id as funcao_id',
        'f.dpto_id as dpto_id',
        'f.salario_bruto as salario_bruto',
        'f.encargos as encargos',
        'f.provisoes as provisoes',
        'f.beneficios as beneficios',
        'f.created_at as created_at',
        'f.updated_at as updated_at',
        'f.user_id_log as user_id_log',
        'fu.nome as funcao_nome',
        'd.nome as departamento_nome',
      ])

    qb.where('f.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere(
        new Brackets(qb1 => {
          qb1
            .where('f.excluido = :excluido1', { excluido1: 'Não' })
            .orWhere('f.excluido = :excluido2', { excluido2: 'Nao' })
        }),
      )

    if (search) {
      qb.andWhere(
        `
          (
            LOWER(f.nome_completo) LIKE :search
            OR LOWER(COALESCE(f.cpf, '')) LIKE :search
            OR LOWER(COALESCE(f.rg, '')) LIKE :search
            OR LOWER(COALESCE(f.pis_pasep, '')) LIKE :search
            OR LOWER(COALESCE(f.municipio, '')) LIKE :search
            OR LOWER(COALESCE(fu.nome, '')) LIKE :search
            OR LOWER(COALESCE(d.nome, '')) LIKE :search
          )
        `,
        { search: `%${search.toLowerCase()}%` },
      )
    }

    qb.orderBy('f.nome_completo', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [rows, total] = await Promise.all([qb.getRawMany(), qb.getCount()])

    const data = rows.map(row => ({
      funcionario_id: Number(row.funcionario_id),
      idtb_empresas: Number(row.idtb_empresas),
      nome_completo: row.nome_completo,
      cpf: row.cpf,
      rg: row.rg,
      pis_pasep: row.pis_pasep,
      data_nascimento: row.data_nascimento,
      endereco: row.endereco,
      cep: row.cep,
      bairro: row.bairro,
      municipio: row.municipio,
      sexo: row.sexo,
      estado_civil: row.estado_civil,
      grau_instrucao: row.grau_instrucao,
      carteira_trabalho: row.carteira_trabalho,
      serie: row.serie,
      uf: row.uf,
      data_carteira_trabalho: row.data_carteira_trabalho,
      data_admissao: row.data_admissao,
      data_demissao: row.data_demissao,
      funcao_id: row.funcao_id ? Number(row.funcao_id) : null,
      dpto_id: row.dpto_id ? Number(row.dpto_id) : null,
      salario_bruto: Number(row.salario_bruto || 0),
      encargos: Number(row.encargos || 0),
      provisoes: Number(row.provisoes || 0),
      beneficios: Number(row.beneficios || 0),
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_id_log: row.user_id_log,
      funcao_nome: row.funcao_nome,
      departamento_nome: row.departamento_nome,
    }))

    return { data, total }
  }

  async criar(data: any) {
    const normalizado = this.normalizarDados(data)

    await this.validarRelacionamentos(
      Number(normalizado.idtb_empresas),
      normalizado.funcao_id,
      normalizado.dpto_id,
    )

    return this.repo.save(this.repo.create(normalizado))
  }

  async atualizar(funcionario_id: number, idtb_empresas: number, data: any) {
    const funcionario = await this.repo.findOne({
      where: { funcionario_id, idtb_empresas },
    })

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado')
    }

    const normalizado = this.normalizarDados({
      ...data,
      idtb_empresas,
    })

    await this.validarRelacionamentos(
      Number(idtb_empresas),
      normalizado.funcao_id,
      normalizado.dpto_id,
    )

    Object.assign(funcionario, normalizado)
    return this.repo.save(funcionario)
  }

  async excluir(
    funcionario_id: number,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    const funcionario = await this.repo.findOne({
      where: { funcionario_id, idtb_empresas },
    })

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado')
    }

    funcionario.excluido = 'Sim'
    funcionario.user_id_log = user_id_log

    return this.repo.save(funcionario)
  }

  async importar(
    registros: any[],
    idtb_empresas: number,
    user_id_log: string,
  ) {
    if (!Array.isArray(registros) || registros.length === 0) {
      throw new BadRequestException('Nenhum registro enviado para importação')
    }

    let inseridos = 0
    let atualizados = 0
    let descartados = 0

    for (const linha of registros) {
      const cpfNormalizado = this.normalizarCpf(linha?.cpf)

      if (!cpfNormalizado) {
        descartados++
        continue
      }

      const funcaoId = await this.buscarFuncaoIdPorNome(
        linha?.funcao,
        idtb_empresas,
      )

      const departamentoId = await this.buscarDepartamentoIdPorNome(
        linha?.departamento,
        idtb_empresas,
      )

      const payload = this.normalizarDados({
        idtb_empresas,
        user_id_log,
        nome_completo: linha?.nome_completo || '',
        cpf: cpfNormalizado,
        rg: linha?.rg || null,
        pis_pasep: linha?.pis_pasep || null,
        data_nascimento: this.normalizarData(linha?.data_nascimento),
        endereco: linha?.endereco || null,
        cep: linha?.cep || null,
        bairro: linha?.bairro || null,
        municipio: linha?.municipio || null,
        sexo: this.normalizarSexo(linha?.sexo),
        estado_civil: this.normalizarEstadoCivil(linha?.estado_civil),
        grau_instrucao: linha?.grau_instrucao || null,
        carteira_trabalho: linha?.carteira_trabalho || null,
        serie: linha?.serie || null,
        uf: linha?.uf ? String(linha.uf).trim().toUpperCase().slice(0, 2) : null,
        data_carteira_trabalho: this.normalizarData(
          linha?.data_carteira_trabalho,
        ),
        data_admissao: this.normalizarData(linha?.data_admissao),
        data_demissao: this.normalizarData(linha?.data_demissao),
        funcao_id: funcaoId,
        dpto_id: departamentoId,
        salario_bruto: this.normalizarNumero(linha?.salario_bruto),
        encargos: this.normalizarNumero(linha?.encargos),
        provisoes: this.normalizarNumero(linha?.provisoes),
        beneficios: this.normalizarNumero(linha?.beneficios),
      })

      const existente = await this.repo.findOne({
        where: {
          idtb_empresas,
          cpf: cpfNormalizado,
        },
      })

      if (existente) {
        Object.assign(existente, payload, {
          user_id_log,
          excluido: 'Não',
        })
        await this.repo.save(existente)
        atualizados++
      } else {
        const novo = this.repo.create({
          ...payload,
          user_id_log,
          excluido: 'Não',
        })
        await this.repo.save(novo)
        inseridos++
      }
    }

    return {
      message: 'Importação concluída com sucesso',
      inseridos,
      atualizados,
      descartados,
      total_processado: registros.length,
    }
  }

  private normalizarDados(data: any) {
    return {
      ...data,
      idtb_empresas: Number(data.idtb_empresas),
      funcao_id:
        data.funcao_id !== '' &&
        data.funcao_id !== null &&
        data.funcao_id !== undefined
          ? Number(data.funcao_id)
          : null,
      dpto_id:
        data.dpto_id !== '' &&
        data.dpto_id !== null &&
        data.dpto_id !== undefined
          ? Number(data.dpto_id)
          : null,
      salario_bruto: Number(data.salario_bruto || 0),
      encargos: Number(data.encargos || 0),
      provisoes: Number(data.provisoes || 0),
      beneficios: Number(data.beneficios || 0),
      cpf: data.cpf || null,
      rg: data.rg || null,
      pis_pasep: data.pis_pasep || null,
      data_nascimento: data.data_nascimento || null,
      endereco: data.endereco || null,
      cep: data.cep || null,
      bairro: data.bairro || null,
      municipio: data.municipio || null,
      sexo: data.sexo || null,
      estado_civil: data.estado_civil || null,
      grau_instrucao: data.grau_instrucao || null,
      carteira_trabalho: data.carteira_trabalho || null,
      serie: data.serie || null,
      uf: data.uf || null,
      data_carteira_trabalho: data.data_carteira_trabalho || null,
      data_admissao: data.data_admissao || null,
      data_demissao: data.data_demissao || null,
    }
  }

  private async validarRelacionamentos(
    idtb_empresas: number,
    funcao_id?: number | null,
    dpto_id?: number | null,
  ) {
    if (funcao_id) {
      const funcao = await this.funcaoRepo
        .createQueryBuilder('f')
        .where('f.func_id = :func_id', { func_id: Number(funcao_id) })
        .andWhere('f.idtb_empresas = :idtb_empresas', { idtb_empresas })
        .andWhere(
          new Brackets(qb => {
            qb
              .where('f.excluido = :excluido1', { excluido1: 'Não' })
              .orWhere('f.excluido = :excluido2', { excluido2: 'Nao' })
          }),
        )
        .getOne()

      if (!funcao) {
        throw new BadRequestException('Função não encontrada')
      }
    }

    if (dpto_id) {
      const departamento = await this.departamentoRepo
        .createQueryBuilder('d')
        .where('d.dpto_id = :dpto_id', { dpto_id: Number(dpto_id) })
        .andWhere('d.idtb_empresas = :idtb_empresas', { idtb_empresas })
        .andWhere(
          new Brackets(qb => {
            qb
              .where('d.excluido = :excluido1', { excluido1: 'Não' })
              .orWhere('d.excluido = :excluido2', { excluido2: 'Nao' })
          }),
        )
        .getOne()

      if (!departamento) {
        throw new BadRequestException('Departamento não encontrado')
      }
    }
  }

  private normalizarCpf(value: any) {
    if (value === null || value === undefined) return ''
    return String(value).replace(/\D/g, '').trim()
  }

  private normalizarSexo(value: any) {
    const texto = String(value || '').trim().toLowerCase()

    if (texto === 'masculino') return 'Masculino'
    if (texto === 'feminino') return 'Feminino'
    if (texto === 'outro') return 'Outro'

    return 'Outro'
  }

  private normalizarEstadoCivil(value: any) {
    const texto = String(value || '').trim().toLowerCase()

    if (texto === 'solteiro(a)' || texto === 'solteiro' || texto === 'solteira') {
      return 'Solteiro(a)'
    }

    if (texto === 'casado(a)' || texto === 'casado' || texto === 'casada') {
      return 'Casado(a)'
    }

    if (
      texto === 'divorciado(a)' ||
      texto === 'divorciado' ||
      texto === 'divorciada'
    ) {
      return 'Divorciado(a)'
    }

    if (texto === 'viúvo(a)' || texto === 'viuvo(a)' || texto === 'viuvo' || texto === 'viúva' || texto === 'viuva') {
      return 'Viúvo(a)'
    }

    if (
      texto === 'união estavel' ||
      texto === 'uniao estavel' ||
      texto === 'união estável' ||
      texto === 'uniao estável'
    ) {
      return 'União Estavel'
    }

    return null
  }

  private normalizarNumero(value: any) {
    if (value === null || value === undefined || value === '') return 0

    const texto = String(value).trim()

    if (!texto) return 0

    const normalizado = texto.includes(',')
      ? texto.replace(/\./g, '').replace(',', '.')
      : texto

    const numero = Number(normalizado)
    return isNaN(numero) ? 0 : numero
  }

  private normalizarData(value: any) {
    if (!value) return null

    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10)
    }

    if (typeof value === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30))
      const data = new Date(excelEpoch.getTime() + value * 86400000)
      if (!isNaN(data.getTime())) {
        return data.toISOString().slice(0, 10)
      }
    }

    const texto = String(value).trim()
    if (!texto) return null

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
      return texto
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      const [dia, mes, ano] = texto.split('/')
      return `${ano}-${mes}-${dia}`
    }

    const data = new Date(texto)
    if (!isNaN(data.getTime())) {
      return data.toISOString().slice(0, 10)
    }

    return null
  }

  private async buscarFuncaoIdPorNome(
    nome: any,
    idtb_empresas: number,
  ): Promise<number | null> {
    const texto = String(nome || '').trim()
    if (!texto) return null

    const funcao = await this.funcaoRepo
      .createQueryBuilder('f')
      .where('f.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere('LOWER(f.nome) = LOWER(:nome)', { nome: texto })
      .andWhere(
        new Brackets(qb => {
          qb
            .where('f.excluido = :excluido1', { excluido1: 'Não' })
            .orWhere('f.excluido = :excluido2', { excluido2: 'Nao' })
        }),
      )
      .getOne()

    return funcao ? Number((funcao as any).func_id) : null
  }

  private async buscarDepartamentoIdPorNome(
    nome: any,
    idtb_empresas: number,
  ): Promise<number | null> {
    const texto = String(nome || '').trim()
    if (!texto) return null

    const departamento = await this.departamentoRepo
      .createQueryBuilder('d')
      .where('d.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere('LOWER(d.nome) = LOWER(:nome)', { nome: texto })
      .andWhere(
        new Brackets(qb => {
          qb
            .where('d.excluido = :excluido1', { excluido1: 'Não' })
            .orWhere('d.excluido = :excluido2', { excluido2: 'Nao' })
        }),
      )
      .getOne()

    return departamento ? Number((departamento as any).dpto_id) : null
  }
}