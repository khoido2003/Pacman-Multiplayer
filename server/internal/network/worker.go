package network

import (
	"log"
	"sync"
)

// Worker
type Worker struct {
	ID int

	WaitGroup *sync.WaitGroup
}

// Create new worker
func NewWorker(id int, wg *sync.WaitGroup) *Worker {
	return &Worker{
		ID: id,

		WaitGroup: wg,
	}
}

// Start worker
func (w *Worker) Start(JobQueue *chan func()) {
	go func() {
		defer w.WaitGroup.Done()

		for job := range *JobQueue {
			log.Printf("Worker %d started job: ", w.ID)
			job()
			log.Printf("Worker %d finished job: ", w.ID)
		}
	}()
}

/////////////////////////////////////////

// Thread pool manager
type Pool struct {
	Workers   []*Worker
	JobQueue  chan func()
	WaitGroup *sync.WaitGroup
}

// Create new thread pool
func NewPool(workerCount int) *Pool {
	pool := &Pool{

		// Allow buffered 1000 jobs before processing
		JobQueue:  make(chan func(), 1000),
		WaitGroup: &sync.WaitGroup{},
	}

	for i := 1; i <= workerCount; i++ {
		worker := NewWorker(i, pool.WaitGroup)

		pool.Workers = append(pool.Workers, worker)
		worker.Start(&pool.JobQueue)
	}
	return pool
}

// Add new job to the pool
func (p *Pool) AddJob(job func()) {
	p.WaitGroup.Add(1)

	// Since add new job into full queue might cause deadlock panic so
	// using a new goroutine to do this
	go func() {
		p.JobQueue <- job
	}()
}

// Stop the worker pool
func (p *Pool) Stop() {
	close(p.JobQueue)
	p.WaitGroup.Wait()
}
