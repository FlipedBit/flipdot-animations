// controls.js — Generates input controls based on animation-specified config

function renderControls(controlDefs = []) {
  const panel = document.getElementById('controls');
  panel.innerHTML = ''; // Clear previous controls

  controlDefs.forEach(def => {
    const wrapper = document.createElement('div');
    wrapper.className = 'control';

// === BUTTON ===
if (def.type === 'button') {
  const button = document.createElement('button');
  button.textContent = typeof def.label === 'function' ? def.label() : def.label;
  button.addEventListener('click', () => {
    def.onClick();
    // Re-render UI so button label updates dynamically
    renderControls(window.getControls());
  });
  wrapper.appendChild(button);
  panel.appendChild(wrapper);
  return;
}

    // === DISPLAY ===
    if (def.type === 'display') {
      const span = document.createElement('span');
      span.id = def.varName;
      span.style.marginLeft = '10px';
      span.textContent = '...';
      wrapper.appendChild(document.createTextNode(def.label));
      wrapper.appendChild(span);
      panel.appendChild(wrapper);
      return;
    }

    // === RANGE / SLIDER ===
    if (def.type === 'range') {
      const label = document.createElement('label');
      label.textContent = def.label;
      wrapper.appendChild(label);

      const input = document.createElement('input');
      input.type = 'range';
      input.min = def.min;
      input.max = def.max;
      input.step = def.step || 1;
      input.value = def.value;
      const valueLabel = document.createElement('span');
      valueLabel.textContent = input.value;
      // code to show value next to slider
      valueLabel.style.marginLeft = '8px';

      input.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        valueLabel.textContent = val;
        if (typeof def.onInput === 'function') def.onInput(val);
      });

      wrapper.appendChild(input);
      wrapper.appendChild(valueLabel);
      panel.appendChild(wrapper);
      return;
    }

    // === INPUT (TEXT) ===
    if (def.type === 'input') {
      const label = document.createElement('label');
      label.textContent = def.label;
      wrapper.appendChild(label);

      const input = document.createElement('input');
      input.type = 'text';
      input.id = def.id;
      input.value = def.value || '';

      input.addEventListener('input', (e) => {
        if (typeof def.onInput === 'function') def.onInput(e.target.value);
      });

      wrapper.appendChild(input);
      panel.appendChild(wrapper);
      return;
    }

    // === SELECT (DROPDOWN) ===
    if (def.type === 'select') {
      const label = document.createElement('label');
      label.textContent = def.label;
      wrapper.appendChild(label);

      const select = document.createElement('select');
      select.id = def.id;

      def.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === def.value) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      select.addEventListener('change', (e) => {
        if (typeof def.onChange === 'function') def.onChange(e.target.value);
      });

      wrapper.appendChild(select);
      panel.appendChild(wrapper);
      return;
    }
    // === CHECKBOX ===
    if (def.type === 'checkbox') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = def.checked;
      checkbox.addEventListener('change', e => {
        def.onChange(e.target.checked);
      });

      const label = document.createElement('label');
      label.textContent = def.label;
      label.style.marginLeft = '6px';

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      panel.appendChild(wrapper);
      return;
    }
    // === UNKNOWN TYPE ===
    console.warn('Unknown control type:', def);
  });
}
