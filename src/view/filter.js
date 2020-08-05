const createFilterTemplate = (filter, isActive) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isActive ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

export const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters
    .map((filter, index) => createFilterTemplate(filter, index === 0))
    .join(``);

  return `<section class="main__filter filter container">
    ${filtersTemplate}
  </section>`;
};
