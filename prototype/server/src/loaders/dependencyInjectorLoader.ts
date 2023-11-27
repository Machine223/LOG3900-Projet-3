import { Container } from 'typedi';

export default (models: { name: string; model: any }[]) => {
    try {
        models.forEach((m) => {
            Container.set(m.name, m.model);
        });
    } catch (e) {
        console.error('Error on dependency injector loader: ', e);
        throw e;
    }
};
