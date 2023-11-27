import { Container } from 'typedi';

export default (models: { name: string; element: any }[]) => {
    try {
        models.forEach((m) => {
            Container.set(m.name, m.element);
        });
    } catch (e) {
        console.error('Error on dependency injector loader: ', e);
        throw e;
    }
    console.info('🙏  Dependency Injector loaded');
};
