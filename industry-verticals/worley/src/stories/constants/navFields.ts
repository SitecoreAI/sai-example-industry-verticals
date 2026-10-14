import { createPlaceholderImageSrc, createTextField } from '../helpers/createFields';

export const createNavItem = (text: string) => {
  return {
    Id: `${text}-${Date.now()}`,
    Href: '#',
    Querystring: '',
    DisplayName: text,
    Title: createTextField(text),
    NavigationTitle: createTextField(text),
  };
};

export const arrayToObject = <T>(arr: T[]): Record<string, T> =>
  arr.reduce(
    (acc, item, index) => {
      acc[String(index)] = item;
      return acc;
    },
    {} as Record<string, T>
  );

export const navRoot = {
  ...createNavItem('Home'),
  Styles: ['level0', 'submenu', 'item0', 'odd', 'first', 'last', 'active'],
};

export const topLevelPages = [
  {
    ...createNavItem('Industries'),
    Styles: ['level1', 'item0', 'odd', 'first'],
    Children: [
      {
        ...createNavItem('Conventional energy'),
        Styles: ['level2', 'item0', 'odd', 'first'],
      },
      {
        ...createNavItem('Low carbon energy'),
        Styles: ['level2', 'item1', 'even'],
      },
      {
        ...createNavItem('Resources'),
        Styles: ['level2', 'item2', 'odd', 'last'],
      },
    ],
  },
  {
    ...createNavItem('Solutions'),
    Styles: ['level1', 'item1', 'even'],
    Children: [
      {
        ...createNavItem('Project delivery'),
        Styles: ['level2', 'item0', 'odd', 'first'],
      },
      {
        ...createNavItem('Data centers'),
        Styles: ['level2', 'item1', 'even', 'last'],
      },
    ],
  },
  {
    ...createNavItem('Insights'),
    Styles: ['level1', 'item2', 'odd', 'last'],
  },
];

export const flatTopLevelPages = [
  {
    ...createNavItem('Industries'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level1'],
  },
  {
    ...createNavItem('Solutions'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('Insights'),
    Styles: ['level0', 'item2', 'odd', 'flat-level1'],
  },
  {
    ...createNavItem('About Worley'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level2'],
  },
  {
    ...createNavItem('Contact'),
    Styles: ['level0', 'item1', 'even', 'last', 'flat-level2'],
  },
];

export const getNavigationFields = (options?: { withRoot?: boolean; flat?: boolean }) => {
  const { withRoot = true, flat = false } = options || {};

  const pages = flat ? flatTopLevelPages : topLevelPages;

  if (withRoot) {
    return {
      0: {
        ...navRoot,
        Children: pages,
      },
    };
  }

  return arrayToObject(pages);
};

export const logoParam = `<image mediaid="8cc2a449-e23b-488c-bb23-3d7c7a07f6e7" mediaurl="${createPlaceholderImageSrc(true)}" />`;
