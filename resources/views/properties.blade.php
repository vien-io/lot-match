@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="text-center mt-4">All Properties</h1>

    <!-- Sorting Options -->
    <div class="d-flex justify-content-end mt-3">
        <form action="{{ route('properties') }}" method="GET">
            <select name="sort_by" class="form-select w-auto d-inline-block">
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="size_asc">Size (Small to Large)</option>
                <option value="size_desc">Size (Large to Small)</option>
            </select>
            <button type="submit" class="btn btn-secondary">Sort</button>
        </form>
    </div>

    <!-- Properties Table -->
    <div class="table-responsive mt-4">
        <table class="table table-bordered align-middle">
            <thead class="table-dark">
                <tr>
                    <th>Image</th>
                    <th>Location</th>
                    <th>Size (sq meters)</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($lots as $lot)
                    <tr>
                        <td><img src="{{ asset('storage/' . $lot->image) }}" class="img-thumbnail" width="80"></td>
                        <td>{{ $lot->location }}</td>
                        <td>{{ $lot->size }}</td>
                        <td>₱{{ number_format($lot->price, 2) }}</td>
                        <td>
                            @if($lot->is_reserved)
                                <span class="badge bg-warning">Reserved</span>
                            @elseif($lot->is_sold)
                                <span class="badge bg-danger">Sold</span>
                            @else
                                <span class="badge bg-success">Available</span>
                            @endif
                        </td>
                        <td>
                            <a href="#" class="btn btn-info btn-sm">View</a>
                            @if(!$lot->is_sold)
                                <a href="#" class="btn btn-primary btn-sm">Reserve</a>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center mt-4">
        {{ $lots->links() }}
    </div>
</div>
@endsection
