/** Catálogo ejemplo — simulador "Vende tu equipo" (ajustá precios e imágenes). */
window.TRADE_IN_DATA = {
  categories: [
    {
      id: "iphone",
      name: "iPhone",
      img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "imac",
      name: "iMac",
      img: "https://images.unsplash.com/photo-1527443224154-c4bbf5b8f4ff?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "accesorios",
      name: "Accesorios",
      img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "macbook",
      name: "MacBook",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "ipad",
      name: "iPad",
      img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "watch",
      name: "Apple Watch",
      img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "videojuegos",
      name: "Videojuegos",
      img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "camaras",
      name: "Cámaras",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&h=160&fit=crop&q=80",
    },
    {
      id: "drones",
      name: "Drones",
      img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=160&h=160&fit=crop&q=80",
    },
  ],
  models: {
    iphone: [
      {
        id: "ip11pm",
        name: "iPhone 11 Pro Max",
        year: "2019",
        base: 180000,
        img: "https://images.unsplash.com/photo-1570910051074-3eb694886505?w=320&h=320&fit=crop&q=80",
        capacities: [64, 256, 512],
      },
      {
        id: "ip12pm",
        name: "iPhone 12 Pro Max",
        year: "2020",
        base: 240000,
        img: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=320&h=320&fit=crop&q=80",
        capacities: [128, 256, 512],
      },
      {
        id: "ip13pm",
        name: "iPhone 13 Pro Max",
        year: "2021",
        base: 300000,
        img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=320&h=320&fit=crop&q=80",
        capacities: [128, 256, 512, 1024],
      },
      {
        id: "ip14pm",
        name: "iPhone 14 Pro Max",
        year: "2022",
        base: 390000,
        img: "https://images.unsplash.com/photo-1664478546384-d57ffe74a914?w=320&h=320&fit=crop&q=80",
        capacities: [128, 256, 512, 1024],
      },
      {
        id: "ip15pm",
        name: "iPhone 15 Pro Max",
        year: "2023",
        base: 480000,
        img: "https://images.unsplash.com/photo-1695394577035-862f7201e0f4?w=320&h=320&fit=crop&q=80",
        capacities: [256, 512, 1024],
      },
      {
        id: "ip16pm",
        name: "iPhone 16 Pro Max",
        year: "2024",
        base: 560000,
        img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=320&h=320&fit=crop&q=80",
        capacities: [256, 512, 1024],
      },
      {
        id: "ip17pm",
        name: "iPhone 17 Pro Max",
        year: "2025",
        base: 640000,
        img: "https://images.unsplash.com/photo-1695364894883-29e3ac0d6f14?w=320&h=320&fit=crop&q=80",
        capacities: [256, 512, 1024],
      },
    ],
    imac: [
      {
        id: "imac24",
        name: 'iMac 24"',
        base: 890000,
        img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=320&h=320&fit=crop&q=80",
        capacities: [256, 512, 1024],
      },
    ],
    accesorios: [
      {
        id: "airpods",
        name: "AirPods Pro",
        base: 120000,
        img: "https://images.unsplash.com/photo-1606220945770-b2b6ce2aef0e?w=320&h=320&fit=crop&q=80",
        capacities: null,
      },
    ],
    macbook: [
      {
        id: "mba-m2",
        name: "MacBook Air M2",
        base: 720000,
        img: "https://images.unsplash.com/photo-1661961112951-fadf717756d6?w=320&h=320&fit=crop&q=80",
        capacities: [256, 512, 1024],
      },
    ],
    ipad: [
      {
        id: "ipad10",
        name: "iPad 10.ª gen.",
        base: 180000,
        img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&h=320&fit=crop&q=80",
        capacities: [64, 256],
      },
    ],
    watch: [
      {
        id: "s8",
        name: "Apple Watch Series 8",
        base: 160000,
        img: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=320&h=320&fit=crop&q=80",
        capacities: [32, 64],
      },
    ],
    videojuegos: [
      {
        id: "ps4",
        name: "PlayStation 4",
        base: 150000,
        img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=320&h=320&fit=crop&q=80",
        capacities: [500, 1000],
      },
    ],
    camaras: [
      {
        id: "gopro",
        name: "GoPro Hero",
        base: 180000,
        img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=320&h=320&fit=crop&q=80",
        capacities: [32, 64, 128],
      },
    ],
    drones: [
      {
        id: "dji",
        name: "DJI Mini",
        base: 320000,
        img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=320&h=320&fit=crop&q=80",
        capacities: null,
      },
    ],
  },
};
