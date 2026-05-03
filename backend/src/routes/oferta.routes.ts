import { Router } from 'express'
import { OfertaController } from '../controllers/OfertaController'
import { autenticar, autorizar } from '../middlewares/authRoles'
//cada arquivo de rotas cuida de um dominio separado
//autenticar = verifica se o usuario esta logado (tem token valido)
//autorizar() = verifica se o perfil do usuario tem permissao para aquela rota
const router = Router() //aplica o login em TODAS as rotas abaixo
router.use(autenticar) //obs: nenhuma rota de oferta funciona sem estar logado
router.get('/', OfertaController.listar)//qualquer usuario logado pode ver as ofertas disponiveis (SCRUM-26)
router.post('/', autorizar('NAPA', 'ADMIN'), OfertaController.criar) //so NAPA e ADMIN podem criar novas ofertas
//autorizar('NAPA', 'ADMIN') bloqueia qualquer outro perfil com erro 403
export default router