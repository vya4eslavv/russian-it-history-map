update achievements
set
    image_url = case slug
        when '1c' then '1С.png'
        when 'automatic-digital-machine-project-1948' then 'АЦЭМ.webp'
        when 'ural' then 'Урал.jpg'
        when 'yandex' then 'Яндекс.jpg'
        when 'setun' then 'Сетунь.jpg'
        when 'elektronika-70' then 'Электроника-70.jpg'
        when 'sm-evm' then 'СМ_ЭВМ.jpg'
        when 'elbrus' then 'Эльбрус.jpg'
        when 'kamaz-autonomous-trucks' then 'Камаз.jpg'
        when 'kaspersky' then 'kasper_intro.jpg'
        when 'postgres-pro' then 'Postgres Pro.jpg'
        when 'yadro' then 'yadro-logo1.webp'
        when 'kotlin' then 'kotlin-logo.png'
        when 'aurora-os' then 'Аврора.webp'
        when 'baikal-m' then 'байкал.webp'
        when 'besm' then 'БЭСМ.webp'
        when 'mvs-1000m' then 'МВС1000.png'
        else image_url
    end,
    image_alt = case slug
        when '1c' then 'Логотип 1С'
        when 'automatic-digital-machine-project-1948' then 'Проект автоматической цифровой электронной машины'
        when 'ural' then 'ЭВМ Урал'
        when 'yandex' then 'Логотип Яндекса'
        when 'setun' then 'ЭВМ Сетунь'
        when 'elektronika-70' then 'Электроника-70'
        when 'sm-evm' then 'Система малых ЭВМ'
        when 'elbrus' then 'Процессор Эльбрус'
        when 'kamaz-autonomous-trucks' then 'Беспилотный грузовик КАМАЗ'
        when 'kaspersky' then 'Логотип Лаборатории Касперского'
        when 'postgres-pro' then 'Логотип Postgres Pro'
        when 'yadro' then 'Логотип YADRO'
        when 'kotlin' then 'Логотип Kotlin'
        when 'aurora-os' then 'Логотип Аврора'
        when 'baikal-m' then 'Процессор Baikal-M'
        when 'besm' then 'ЭВМ БЭСМ'
        when 'mvs-1000m' then 'Суперкомпьютер МВС-1000/М'
        else image_alt
    end,
    image_caption = case slug
        when '1c' then '1С'
        when 'automatic-digital-machine-project-1948' then 'Проект АЦЭМ'
        when 'ural' then 'Урал'
        when 'yandex' then 'Яндекс'
        when 'setun' then 'Сетунь'
        when 'elektronika-70' then 'Электроника-70'
        when 'sm-evm' then 'СМ ЭВМ'
        when 'elbrus' then 'Эльбрус'
        when 'kamaz-autonomous-trucks' then 'КАМАЗ'
        when 'kaspersky' then 'Лаборатория Касперского'
        when 'postgres-pro' then 'Postgres Pro'
        when 'yadro' then 'YADRO'
        when 'kotlin' then 'Kotlin'
        when 'aurora-os' then 'Аврора'
        when 'baikal-m' then 'Baikal-M'
        when 'besm' then 'БЭСМ'
        when 'mvs-1000m' then 'МВС-1000/М'
        else image_caption
    end
where slug in (
    '1c',
    'automatic-digital-machine-project-1948',
    'ural',
    'yandex',
    'setun',
    'elektronika-70',
    'sm-evm',
    'elbrus',
    'kamaz-autonomous-trucks',
    'kaspersky',
    'postgres-pro',
    'yadro',
    'kotlin',
    'aurora-os',
    'baikal-m',
    'besm',
    'mvs-1000m'
);