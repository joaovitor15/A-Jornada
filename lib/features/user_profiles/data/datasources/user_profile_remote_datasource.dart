import '../models/user_profile_model.dart';

abstract class UserProfileRemoteDataSource {
  /// Buscar todos os perfis do usuário
  /// Retorna lista vazia se nenhum perfil encontrado
  Future<List<UserProfileModel>> getAll(String userId);

  /// Buscar perfil por ID
  /// Retorna null se não encontrado
  Future<UserProfileModel?> getById(String profileId);

  /// Buscar perfils ativos do usuário
  /// Retorna apenas perfis com active = true
  Future<List<UserProfileModel>> getActive(String userId);

  /// Criar novo perfil
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<UserProfileModel> create(UserProfileModel model);

  /// Atualizar perfil existente
  /// Lança [ValidationException] se dados inválidos
  /// Lança [NetworkException] se erro de conexão
  Future<UserProfileModel> update(UserProfileModel model);

  /// Deletar perfil
  /// Lança [NetworkException] se erro de conexão
  Future<void> delete(String profileId);

  /// Definir perfil como ativo (atual)
  /// Apenas um perfil pode ser ativo por usuário
  Future<void> setActive(String userId, String profileId);
}