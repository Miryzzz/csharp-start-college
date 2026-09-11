export const courseTopics = [
  {
    id: 'variables',
    title: 'Переменные и типы',
    summary: 'Переменная хранит данные, с которыми работает программа.',
    explanation: 'Тип подсказывает C#, какие данные мы сохраняем: текст, целое число или дробь.',
    code: 'string name = "Аня";\nint age = 17;\nConsole.WriteLine(name);',
    output: 'Аня',
  },
  {
    id: 'io',
    title: 'Ввод и вывод',
    summary: 'Программа может получать данные и показывать результат.',
    explanation: 'Console.WriteLine выводит строку в консоль, а Console.ReadLine читает введённый текст.',
    code: 'Console.Write("Как тебя зовут? ");\nstring name = Console.ReadLine();\nConsole.WriteLine($"Привет, {name}!");',
    output: 'Как тебя зовут? Миша\nПривет, Миша!',
  },
  {
    id: 'conditions',
    title: 'Условия',
    summary: 'Условие помогает выбрать действие в зависимости от ситуации.',
    explanation: 'Конструкция if проверяет выражение. Блок else запускается, когда условие не выполняется.',
    code: 'int score = 8;\nif (score >= 5)\n{\n  Console.WriteLine("Зачёт");\n}',
    output: 'Зачёт',
  },
  {
    id: 'loops',
    title: 'Циклы',
    summary: 'Цикл повторяет действие, пока есть нужное количество шагов.',
    explanation: 'Цикл for удобен, когда число повторений известно заранее.',
    code: 'for (int i = 1; i <= 3; i++)\n{\n  Console.WriteLine(i);\n}',
    output: '1\n2\n3',
  },
  {
    id: 'methods',
    title: 'Методы',
    summary: 'Метод собирает повторяющееся действие под понятным именем.',
    explanation: 'Методы делают программу короче, понятнее и позволяют переиспользовать код.',
    code: 'static void Greet(string name)\n{\n  Console.WriteLine($"Привет, {name}!");\n}\n\nGreet("Лена");',
    output: 'Привет, Лена!',
  },
] as const;

export type TopicId = (typeof courseTopics)[number]['id'];

export const topicIds = courseTopics.map((topic) => topic.id) as TopicId[];
