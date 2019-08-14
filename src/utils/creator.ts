import consola from 'consola';
import * as fs from 'fs';
import { Setting } from '../interface';
import { vueTemplate } from '../templates/vueTemplate';
import { mixinTemplate } from '../templates/mixinTemplate';
import { specTemplate } from '../templates/specTemplate';
import { handleError, handleLogger } from './handler';

export default class {
  private components: Array<Setting>;
  private mixin: Setting;
  private fileName: string;

  constructor(components: Array<Setting>, mixin: Setting, fileName: string) {
    this.components = components;
    this.mixin = mixin;
    this.fileName = fileName;
  }


  createVue(path: string) {
    if (!path) {
      handleError('components配下にpathフィールドが存在しません。');
    }

    fs.writeFile(`${path}/${this.fileName}.vue`, vueTemplate(this.fileName, this.mixin.path), err => {
      if (err) return handleError(err.message);
      handleLogger("success", `[CREATE] ${path}/${this.fileName}.vue`);
    });
  };

  createTest(path: string, testPath: string = "") {
    if (!path) {
      handleError('components配下にpathフィールドが存在しません。');
    }
    const filePath = testPath ? testPath : path;
    fs.writeFile(`${filePath}/${this.fileName}.spec.js`, specTemplate(this.fileName), err => {
      if (err) return handleError(err.message);
      handleLogger("success", `[CREATE] ${filePath}/${this.fileName}.spec.js`);
    });
  }

  createMixin() {
    const { path } = this.mixin;
    if (!path) {
      handleError('mixin配下にpathフィールドが存在しません。');
    }
    fs.writeFile(`${path}/${this.fileName}.js`, mixinTemplate(), err => {
      if (err) return handleError(err.message);
      handleLogger("success", `[CREATE] ${path}/${this.fileName}.js`);
    });
  }

  createFiles() {
    for (const component of this.components) {
      if (!component.path) {
        return handleError('componentsオブジェクトにpathフィールドが存在しません。');
      }
      this.createVue(component.path);
      if (component.test) {
        this.createTest(component.path, component.testPath);
      }
    }
    if (this.mixin && this.mixin.path) {
      this.createMixin();

      if (this.mixin.test) {
        this.createTest(this.mixin.path, this.mixin.testPath);
      }
    }
  }
};