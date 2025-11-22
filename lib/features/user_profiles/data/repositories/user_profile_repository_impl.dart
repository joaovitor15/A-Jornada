// lib/features/user_profiles/data/repositories/user_profile_repository_impl.dart
import 'package:myapp/core/utils/logger.dart';
import '../../domain/entities/user_profile_entity.dart';
import '../../domain/repositories/user_profile_repository.dart';
import '../datasources/user_profile_remote_datasource.dart';
import '../models/user_profile_model.dart';

class UserProfileRepositoryImpl implements UserProfileRepository {
  final UserProfileRemoteDataSource _remoteDataSource;
  final Logger _logger = Logger();

  UserProfileRepositoryImpl({required UserProfileRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<List<UserProfileEntity>> getAllByUser(String userId) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Buscando perfis do usuário $userId');

      final models = await _remoteDataSource.getAll(userId);
      final entities = models.map((m) => m.toEntity()).toList();

      _logger.info('UserProfileRepositoryImpl: ${entities.length} perfis encontrados');

      return entities;
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao buscar perfis do usuário',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<UserProfileEntity?> getById(String profileId) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Buscando perfil $profileId');

      final model = await _remoteDataSource.getById(profileId);

      if (model == null) {
        _logger.info('UserProfileRepositoryImpl: Perfil $profileId não encontrado');
        return null;
      }

      final entity = model.toEntity();

      _logger.info('UserProfileRepositoryImpl: Perfil encontrado: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao buscar perfil por ID',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<UserProfileEntity> create({
    required String userId,
    required String name,
    required String type,
    String? icon,
    String? color,
    int sortOrder = 0,
  }) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Criando perfil "$name"');

      final model = UserProfileModel(
        id: '', // Será gerado pelo servidor
        userId: userId,
        name: name,
        type: type,
        icon: icon,
        color: color,
        active: true,
        sortOrder: sortOrder,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final createdModel = await _remoteDataSource.create(model);
      final entity = createdModel.toEntity();

      _logger.info('UserProfileRepositoryImpl: Perfil criado com sucesso: ${entity.id}');

      return entity;
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao criar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<UserProfileEntity> update({
    required String id,
    String? name,
    String? type,
    String? icon,
    String? color,
    bool? active,
    int? sortOrder,
  }) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Atualizando perfil $id');

      // Buscar perfil atual
      final currentModel = await _remoteDataSource.getById(id);

      if (currentModel == null) {
        throw Exception('Perfil não encontrado');
      }

      final updatedModel = UserProfileModel(
        id: currentModel.id,
        userId: currentModel.userId,
        name: name ?? currentModel.name,
        type: type ?? currentModel.type,
        icon: icon ?? currentModel.icon,
        color: color ?? currentModel.color,
        active: active ?? currentModel.active,
        sortOrder: sortOrder ?? currentModel.sortOrder,
        createdAt: currentModel.createdAt,
        updatedAt: DateTime.now(),
      );

      final resultModel = await _remoteDataSource.update(updatedModel);
      final entity = resultModel.toEntity();

      _logger.info('UserProfileRepositoryImpl: Perfil atualizado com sucesso');

      return entity;
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao atualizar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<void> delete(String profileId) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Deletando perfil $profileId');

      await _remoteDataSource.delete(profileId);

      _logger.info('UserProfileRepositoryImpl: Perfil deletado com sucesso');
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao deletar perfil',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<int> countByUser(String userId) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Contando perfis do usuário $userId');

      // ✅ CORRIGIDO: Usar getAll e contar
      final models = await _remoteDataSource.getAll(userId);
      final count = models.length;

      _logger.info('UserProfileRepositoryImpl: Total de perfis: $count');

      return count;
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao contar perfis',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }

  @override
  Future<UserProfileEntity> toggleActive(String profileId) async {
    try {
      _logger.info('UserProfileRepositoryImpl: Alternando status do perfil $profileId');

      // Buscar perfil atual
      final currentModel = await _remoteDataSource.getById(profileId);

      if (currentModel == null) {
        throw Exception('Perfil não encontrado');
      }

      final updatedModel = UserProfileModel(
        id: currentModel.id,
        userId: currentModel.userId,
        name: currentModel.name,
        type: currentModel.type,
        icon: currentModel.icon,
        color: currentModel.color,
        active: !currentModel.active,
        sortOrder: currentModel.sortOrder,
        createdAt: currentModel.createdAt,
        updatedAt: DateTime.now(),
      );

      final resultModel = await _remoteDataSource.update(updatedModel);
      final entity = resultModel.toEntity();

      _logger.info('UserProfileRepositoryImpl: Status alterado com sucesso');

      return entity;
    } catch (e, st) {
      _logger.error(
        'UserProfileRepositoryImpl: Erro ao alternar status',
        err: e,
        stackTrace: st,
      );
      rethrow;
    }
  }
}