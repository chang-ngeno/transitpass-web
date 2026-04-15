package ke.co.masajr.transport.repository;

import ke.co.masajr.transport.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByTenantId(Long tenantId);
    List<Trip> findByFromStageId(Long stageId);
}
