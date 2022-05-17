import { TemplateInternship } from '../../../domain/model/teamplate.internship';
import { TemplateInternshipRepository } from '../../../domain/ports/template.internship.repository';
import { AgeInterval } from '../../../domain/vo/age.interval';
import { InMemoryTemplateInternship } from '../../../infrastructure/in.memory/in.memory.template.internship';
import { CreateTemplateInternship } from './create.template.internship';

describe('create template internship', () => {
  let createTemplateInternship: CreateTemplateInternship;
  let templateInternshipRepository: TemplateInternshipRepository;

  beforeEach(async () => {
    templateInternshipRepository = new InMemoryTemplateInternship();
    createTemplateInternship = new CreateTemplateInternship(
      templateInternshipRepository,
    );
  });

  describe('should create a template internship', () => {
    it('should create a template internship', async () => {
      const templateInternshipId = 'abc';
      await createTemplateInternship.run(
        templateInternshipId,
        'title',
        5,
        10,
        20,
      );

      const templateInternshipExpected: TemplateInternship =
        new TemplateInternship(
          templateInternshipId,
          'title',
          5,
          new AgeInterval(10, 20),
        );

      const result = await templateInternshipRepository.get(
        templateInternshipId,
      );
      expect(result).toEqual(templateInternshipExpected);
    });

    it('should create a template internship without age interval', async () => {
      const templateInternshipId = 'abc';
      await createTemplateInternship.run(templateInternshipId, 'title', 5);

      const templateInternshipExpected: TemplateInternship =
        new TemplateInternship(
          templateInternshipId,
          'title',
          5,
          new AgeInterval(undefined, undefined),
        );

      const result = await templateInternshipRepository.get(
        templateInternshipId,
      );
      expect(result).toEqual(templateInternshipExpected);
    });

    it('should create a template internship without start age interval', async () => {
      const templateInternshipId = 'abc';
      await createTemplateInternship.run(
        templateInternshipId,
        'title',
        5,
        undefined,
        10,
      );

      const templateInternshipExpected: TemplateInternship =
        new TemplateInternship(
          templateInternshipId,
          'title',
          5,
          new AgeInterval(undefined, 10),
        );

      const result = await templateInternshipRepository.get(
        templateInternshipId,
      );
      expect(result).toEqual(templateInternshipExpected);
    });

    it('should create a template internship without end age interval', async () => {
      const templateInternshipId = 'abc';
      await createTemplateInternship.run(
        templateInternshipId,
        'title',
        5,
        10,
        undefined,
      );

      const templateInternshipExpected: TemplateInternship =
        new TemplateInternship(
          templateInternshipId,
          'title',
          5,
          new AgeInterval(10, undefined),
        );

      const result = await templateInternshipRepository.get(
        templateInternshipId,
      );
      expect(result).toEqual(templateInternshipExpected);
    });
  });

  describe('should not create a template internship', () => {
    it('when age interval is wrong, end age lt start age', async () => {
      const templateInternshipId = 'abc';
      const startAge = 10;
      const endAge = 8;
      try {
        await createTemplateInternship.run(
          templateInternshipId,
          'title',
          5,
          startAge,
          endAge,
        );
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toStrictEqual('age interval is wrong');
      }
    });

    it('when age interval is wrong, start age negative', async () => {
      const templateInternshipId = 'abc';
      const startAge = -1;
      const endAge = 10;
      try {
        await createTemplateInternship.run(
          templateInternshipId,
          'title',
          5,
          startAge,
          endAge,
        );
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toStrictEqual('age interval is wrong');
      }
    });

    it('when age interval is wrong, end age negative', async () => {
      const templateInternshipId = 'abc';
      const startAge = -1;
      const endAge = -2;
      try {
        await createTemplateInternship.run(
          templateInternshipId,
          'title',
          5,
          startAge,
          endAge,
        );
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toStrictEqual('age interval is wrong');
      }
    });
  });
});
