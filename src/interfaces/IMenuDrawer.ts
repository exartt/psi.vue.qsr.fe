export interface Menu {
  icon: string;
  color?: string;
  name: string;
  route: string;
  disabled?: boolean;
}

export interface Section {
  title?: string;
  menus: Menu[];
}

enum Route {
  HOME = "/default",
  AGENDA = "/agenda",
  PACIENTES = "/pacientes",
  CONTAS_RECEBER = "/contas-receber",
  CONTAS_PAGAR = "/contas-pagar",
  FLUXO_CAIXA = "/fluxo-caixa",
  DASHBOARD = "/dashboard",
  MARKETING = "/marketing",
  METAS = "/metas",
}

enum SectionEnum {
  INICIO,
  FINANCEIRO,
  ESTATISTICAS,
}

const sections: Section[] = [
  {
    title: "Menu",
    menus: [
      {
        route: Route.HOME,
        icon: "home",
        name: "Início",
      },
      {
        route: Route.AGENDA,
        icon: "calendar_month",
        name: "Agenda",
        disabled: false,
      },
      {
        route: Route.PACIENTES,
        icon: "person",
        name: "Pacientes",
      },
    ],
  },
  {
    title: "Financeiro",
    menus: [
      {
        route: Route.CONTAS_RECEBER,
        icon: "monetization_on",
        name: "Entrada",
        color: "green",
        disabled: true,
      },
      {
        route: Route.CONTAS_PAGAR,
        icon: "paid",
        name: "Saída",
        color: "red",
        disabled: true,
      },
      {
        route: Route.FLUXO_CAIXA,
        icon: "point_of_sale",
        name: "Fluxo de caixa",
        disabled: true,
      },
    ],
  },
  {
    title: "Estatísticas",
    menus: [
      {
        route: Route.DASHBOARD,
        icon: "space_dashboard",
        name: "Dashboard",
        disabled: true,
      },
      {
        route: Route.MARKETING,
        icon: "campaign",
        name: "Marketing",
        disabled: true,
      },
      {
        route: Route.METAS,
        icon: "flag",
        name: "Metas",
        disabled: true,
      },
    ],
  },
];

export { sections };
