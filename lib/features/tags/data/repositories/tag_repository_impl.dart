import 'package:myapp/core/utils/logger.dart';
import '../../domain/entities/tag_entity.dart';
import '../../domain/repositories/tag_repository.dart';
import '../datasources/tag_remote_datasource.dart';
import '../models/tag_model.dart';

class TagRepositoryImpl implements TagRepository {
  final TagRemoteDataSource _remoteDataSource;
  final Logger _logger = Logger();

  TagRepositoryImpl({required TagRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<List<TagEntity>> getByProfile(String profileId) async {
    try {
      _logger.info('TagRepositoryImpl: Buscando tags do perfil $profileId');

      final models = await _remoteDataSource.getByProfile(profileId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('TagRepositoryImpl: ${entities.length} tags encontradas');

      return entities;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao buscar tags do perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<TagEntity?> getById(String tagId) async {
    try {
      _logger.info('TagRepositoryImpl: Buscando tag $tagId');

      final model = await _remoteDataSource.getById(tagId);

      if (model == null) {
        _logger.info('TagRepositoryImpl: Tag $tagId não encontrada');
        return null;
      }

      final entity = model.toEntity();

      _logger.info('TagRepositoryImpl: Tag encontrada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao buscar tag por ID',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<TagEntity>> searchByName(String profileId, String searchText) async {
    try {
      _logger.info(
        'TagRepositoryImpl: Buscando tags por nome "$searchText" no perfil $profileId',
      );

      final models = await _remoteDataSource.searchByName(profileId, searchText);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('TagRepositoryImpl: ${entities.length} tags encontradas na busca');

      return entities;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao buscar tags por nome',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<TagEntity> create({
    required String profileId,
    required String name,
    String? color,
    int sortOrder = 0,
  }) async {
    try {
      _logger.info('TagRepositoryImpl: Criando tag "$name" no perfil $profileId');

      final model = TagModel(
        id: '', // Será gerado pelo servidor
        profileId: profileId,
        name: name,
        color: color,
        sortOrder: sortOrder,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final createdModel = await _remoteDataSource.create(model);
      final entity = createdModel.toEntity();

      _logger.info('TagRepositoryImpl: Tag criada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao criar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<TagEntity> update({
    required String id,
    String? name,
    String? color,
    int? sortOrder,
  }) async {
    try {
      _logger.info('TagRepositoryImpl: Atualizando tag $id');

      // Buscar tag atual
      final currentModel = await _remoteDataSource.getById(id);

      if (currentModel == null) {
        throw Exception('Tag não encontrada');
      }

      final updatedModel = TagModel(
        id: currentModel.id,
        profileId: currentModel.profileId,
        name: name ?? currentModel.name,
        color: color ?? currentModel.color,
        sortOrder: sortOrder ?? currentModel.sortOrder,
        createdAt: currentModel.createdAt,
        updatedAt: DateTime.now(),
      );

      final resultModel = await _remoteDataSource.update(updatedModel);
      final entity = resultModel.toEntity();

      _logger.info('TagRepositoryImpl: Tag atualizada: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao atualizar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> delete(String tagId) async {
    try {
      _logger.info('TagRepositoryImpl: Deletando tag $tagId');

      await _remoteDataSource.delete(tagId);

      _logger.info('TagRepositoryImpl: Tag deletada: $tagId');
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao deletar tag',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<int> countByProfile(String profileId) async {
    try {
      _logger.info('TagRepositoryImpl: Contando tags do perfil $profileId');

      final count = await _remoteDataSource.countByProfile(profileId);

      _logger.info('TagRepositoryImpl: Total de tags: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao contar tags',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<List<TagEntity>> getMostUsed(String profileId) async {
    try {
      _logger.info('TagRepositoryImpl: Buscando tags mais usadas do perfil $profileId');

      final models = await _remoteDataSource.getMostUsed(profileId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('TagRepositoryImpl: ${entities.length} tags mais usadas encontradas');

      return entities;
    } catch (e, st) {
      _logger.error(
        'TagRepositoryImpl: Erro ao buscar tags mais usadas',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}