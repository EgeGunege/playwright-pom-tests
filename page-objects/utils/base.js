export class Base {
  /**
   * @param {import('@playwright/test').Page} page - Playwright Page instance
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   * @param {string} url
   * @param {object} [options] - Playwright goto options (timeout, waitUntil, referer, etc.)
   */
  async goTo(url, options = {}) {
    await this.page.goto(url, options);
  }

  /**
   * Generic get element
   * @param {'locator'|'role'|'text'|'label'|'placeholder'|'title'|'testId'} type
   * @param {string|RegExp} value
   * @param {object} [options]
   * @param {import('@playwright/test').Locator} [within]
   * @returns {import('@playwright/test').Locator}
   */
  getElement(type, value, options = {}, within = undefined) {
    const scope = within ?? this.page;
    switch (type) {
      case 'locator':
        return scope.locator(value);
      case 'role':
        return scope.getByRole(value, options);
      case 'text':
        return scope.getByText(value, options);
      case 'label':
        return scope.getByLabel(value, options);
      case 'placeholder':
        return scope.getByPlaceholder(value, options);
      case 'title':
        return scope.getByTitle(value, options);
      case 'testId':
        return scope.getByTestId(value);
      default:
        throw new Error(`Unsupported locator type: ${type}`);
    }
  }

  /**
   * Get nth element of a list
   * @param {import('@playwright/test').Locator} listElement
   * @param {number} [index=0]
   * @returns {import('@playwright/test').Locator}
   */
  getNth(listElement, index = 0) {
    return listElement.nth(index);
  }

  /**
   * Click
   * @param {import('@playwright/test').Locator} element - web element
   * @param {object} [clickOptions] - click options
   */
  async clickElement(element, clickOptions = {}) {
    await element.click(clickOptions);
  }

  /**
   * Fill
   * @param {import('@playwright/test').Locator} element
   * @param {string} value
   * @param {object} [fillOptions]
   */
  async fillElement(element, value, fillOptions = {}) {
    await element.fill(value, fillOptions);
  }

  /**
   * Press characters in sequence (good for autocomplete fields)
   * @param {import('@playwright/test').Locator} element
   * @param {string} text - the text to type sequentially
   * @param {object} [options] - options like delay
   */
  async pressSequentially(element, text, options = {}) {
    await element.pressSequentially(text, options);
  }

  /**
   * Type
   * @param {import('@playwright/test').Locator} element
   * @param {string} text
   * @param {object} [typeOptions]
   */
  async typeElement(element, text, typeOptions = {}) {
    await element.type(text, typeOptions);
  }

  /**
   * Press a key
   * @param {import('@playwright/test').Locator} element
   * @param {string} key
   * @param {object} [pressOptions]
   */
  async pressKey(element, key, pressOptions = {}) {
    await element.press(key, pressOptions);
  }

  /**
   * Check
   * @param {import('@playwright/test').Locator} element
   * @param {object} [options]
   */
  async checkElement(element, options = {}) {
    await element.check(options);
  }

  /**
   * Uncheck
   * @param {import('@playwright/test').Locator} element
   * @param {object} [options]
   */
  async uncheckElement(element, options = {}) {
    await element.uncheck(options);
  }

  /**
   * Select option(s)
   * @param {import('@playwright/test').Locator} element
   * @param {string|string[]|object|Array} selectOption
   * @param {object} [selectOptions]
   */
  async selectElement(element, selectOption, selectOptions = {}) {
    await element.selectOption(selectOption, selectOptions);
  }

  /**
   * Hover
   * @param {import('@playwright/test').Locator} element
   * @param {object} [hoverOptions]
   */
  async hoverElement(element, hoverOptions = {}) {
    await element.hover(hoverOptions);
  }

  /**
   * Double click
   * @param {import('@playwright/test').Locator} element
   * @param {object} [dblOptions]
   */
  async dblclickElement(element, dblOptions = {}) {
    await element.dblclick(dblOptions);
  }

  /**
   * Wait for element state
   * @param {import('@playwright/test').Locator} element
   * @param {'attached'|'detached'|'visible'|'hidden'} [state='visible']
   * @param {object} [waitOptions]
   */
  async waitForElement(element, state = 'visible', waitOptions = {}) {
    await element.waitFor({ state, ...waitOptions });
  }

  /**
   * Wait for first of a list
   * @param {import('@playwright/test').Locator} listElement
   * @param {'attached'|'detached'|'visible'|'hidden'} [state='visible']
   * @param {object} [waitOptions]
   */
  async waitForFirst(listElement, state = 'visible', waitOptions = {}) {
    await listElement.first().waitFor({ state, ...waitOptions });
  }

  /**
   * Wait for nth of a list
   * @param {import('@playwright/test').Locator} listElement
   * @param {number} [index=0]
   * @param {'attached'|'detached'|'visible'|'hidden'} [state='visible']
   * @param {object} [waitOptions]
   */
  async waitForNth(listElement, index = 0, state = 'visible', waitOptions = {}) {
    await this.getNth(listElement, index).waitFor({ state, ...waitOptions });
  }

  /**
   * Screenshot
   * @param {import('@playwright/test').Locator} element
   * @param {string} path
   * @param {object} [shotOptions]
   */
  async screenshotElement(element, path, shotOptions = {}) {
    await element.screenshot({ path, ...shotOptions });
  }

  /**
   * Get textContent
   * @param {import('@playwright/test').Locator} element
   * @returns {Promise<string>}
   */
  async getTextContent(element) {
    return (await element.textContent()) ?? '';
  }

  /**
   * Get innerText
   * @param {import('@playwright/test').Locator} element
   * @returns {Promise<string>}
   */
  async getInnerText(element) {
    return await element.innerText();
  }

  /**
   * Page load state
   * @param {'load'|'domcontentloaded'|'networkidle'} [state='load']
   */
  async waitForLoadState(state = 'load') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for a Playwright Page event (e.g. 'popup', 'response', 'request')
   * @param {string} eventName
   * @param {Function} [predicate] optional filter function
   * @param {object} [options] Playwright waitForEvent options (e.g. timeout)
   * @returns {Promise<any>} event payload (e.g. Page for 'popup', Response for 'response')
   */
  async waitForEvent(eventName, predicate = undefined, options = {}) {
    return await this.page.waitForEvent(eventName, predicate, options);
  }

  /**
   * Handle the next dialog (alert/confirm/prompt) triggered by the given action.
   * Sets a one-time handler BEFORE triggering, so there's no race.
   *
   * @param {() => Promise<any>} trigger - function that triggers the dialog (e.g. click)
   * @param {{accept?: boolean, promptText?: string}} [options]
   * @returns {Promise<{type: string, message: string, defaultValue: string}>}
   */
  async handleNextDialog(trigger, { accept = true, promptText = '' } = {}) {
    let captured;
    const once = (d) => {
      captured = {
        type: d.type(),
        message: d.message(),
        defaultValue: d.defaultValue(),
      };
      return accept ? d.accept(promptText) : d.dismiss();
    };
    this.page.once('dialog', once);
    await trigger(); // click vs.
    // a small microtask wait for if the captured not setted
    if (!captured) await new Promise((r) => setTimeout(r, 0));
    return captured ?? { type: '', message: '', defaultValue: '' };
  }

  /**
   * Arm a one-time dialog handler for the next dialog only.
   * Use when you want to set the handler and then trigger separately.
   *
   * @param {object} [options]
   * @param {boolean} [options.accept=true] - Accept (true) or dismiss (false).
   * @param {string} [options.promptText=''] - Text to send when accepting a prompt().
   * @returns {void}
   */
  armNextDialog({ accept = true, promptText = '' } = {}) {
    this.page.once('dialog', (d) => {
      if (accept) d.accept(promptText);
      else d.dismiss();
    });
  }

  /**
   * Get a FrameLocator for a given <iframe> element.
   * @param {string} selector - CSS/XPath for the <iframe> element
   * @returns {import('@playwright/test').FrameLocator}
   */
  getFrame(selector) {
    return this.page.frameLocator(selector);
  }

  /**
   * Get an element inside a frame using our getElement (scoped with `within`).
   * @param {string} frameSelector - CSS/XPath for the <iframe>
   * @param {'locator'|'role'|'text'|'label'|'placeholder'|'title'|'testId'} type
   * @param {string|RegExp} value
   * @param {object} [options]
   * @returns {import('@playwright/test').Locator}
   */
  getElementInFrame(frameSelector, type, value, options = {}) {
    const frame = this.getFrame(frameSelector);
    return this.getElement(type, value, options, frame);
  }

  /**
   * Click an element inside a frame (uses clickElement for consistency).
   * @param {string} frameSelector
   * @param {'locator'|'role'|'text'|'label'|'placeholder'|'title'|'testId'} type
   * @param {string|RegExp} value
   * @param {object} [options]
   * @param {object} [clickOptions]
   */
  async clickInFrame(frameSelector, type, value, options = {}, clickOptions = {}) {
    const el = this.getElementInFrame(frameSelector, type, value, options);
    await this.clickElement(el, clickOptions);
  }

  /**
   * Fill an input/textarea inside a frame.
   * @param {string} frameSelector
   * @param {'locator'|'role'|'text'|'label'|'placeholder'|'title'|'testId'} type
   * @param {string|RegExp} value
   * @param {string} input
   * @param {object} [options]
   * @param {object} [fillOptions]
   */
  async fillInFrame(frameSelector, type, value, input, options = {}, fillOptions = {}) {
    const el = this.getElementInFrame(frameSelector, type, value, options);
    await this.fillElement(el, input, fillOptions);
  }

  /**
   * Get textContent of an element inside a frame (null-safe → string).
   * @param {string} frameSelector
   * @param {'locator'|'role'|'text'|'label'|'placeholder'|'title'|'testId'} type
   * @param {string|RegExp} value
   * @param {object} [options]
   * @returns {Promise<string>}
   */
  async getTextInFrame(frameSelector, type, value, options = {}) {
    const el = this.getElementInFrame(frameSelector, type, value, options);
    return await this.getTextContent(el);
  }

  /**
   * Wait for an element state inside a frame.
   * @param {string} frameSelector
   * @param {'locator'|'role'|'text'|'label'|'placeholder'|'title'|'testId'} type
   * @param {string|RegExp} value
   * @param {'attached'|'detached'|'visible'|'hidden'} [state='visible']
   * @param {object} [options]
   * @param {object} [waitOptions]
   */
  async waitInFrame(frameSelector, type, value, state = 'visible', options = {}, waitOptions = {}) {
    const el = this.getElementInFrame(frameSelector, type, value, options);
    await this.waitForElement(el, state, waitOptions);
  }

  /**
   * Set file(s) to an <input type="file">
   * @param {import('@playwright/test').Locator} element
   * @param {string|Array<string>} files
   * @param {object} [options]
   */
  async setInputFiles(element, files, options = {}) {
    await element.setInputFiles(files, options);
  }
}
